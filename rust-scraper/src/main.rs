use std::fs;
use std::path::Path;
use serde::{Serialize, Deserialize};
use scraper::{Html, Selector};
use chrono::Local;
use regex::Regex;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
struct LegislationDiff {
    target_article: String,
    old_text: String,
    new_text: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
struct LegislationItem {
    id: String,
    title: String,
    date: String,
    effective_date: String,
    source: String,
    #[serde(rename = "type")]
    doc_type: String,
    impact: String,
    areas: Vec<String>,
    summary: String,
    details: String,
    official_link: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    diff: Option<LegislationDiff>,
}

const PREVIC_NEWS_URL: &str = "https://www.gov.br/previc/pt-br/assuntos/noticias";
const DATABASE_FILE: &str = "src/data/database.ts";

fn clean_text(text: &str) -> String {
    let re = Regex::new(r"\s+").unwrap();
    re.replace_all(text, " ").trim().to_string()
}

fn parse_date(date_str: &str) -> String {
    let re = Regex::new(r"(\d{2})/(\d{2})/(\d{4})").unwrap();
    if let Some(caps) = re.captures(date_str) {
        let day = caps.get(1).map_or("", |m| m.as_str());
        let month = caps.get(2).map_or("", |m| m.as_str());
        let year = caps.get(3).map_or("", |m| m.as_str());
        return format!("{}-{}-{}", year, month, day);
    }
    Local::now().format("%Y-%m-%d").to_string()
}

fn scrape_previc_news() -> Vec<LegislationItem> {
    println!("Buscando atualizações em: {}...", PREVIC_NEWS_URL);
    
    let client = reqwest::blocking::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        .build()
        .unwrap();

    let response = match client.get(PREVIC_NEWS_URL).timeout(std::time::Duration::from_secs(15)).send() {
        Ok(res) => {
            if res.status() != reqwest::StatusCode::OK {
                println!("Erro ao acessar o portal (Código {})", res.status());
                return vec![];
            }
            res.text().unwrap_or_default()
        }
        Err(e) => {
            println!("Falha de conexão com o portal PREVIC: {}", e);
            return vec![];
        }
    };

    let document = Html::parse_document(&response);
    let tile_selector = Selector::parse(".tileItem").unwrap();
    let headline_selector = Selector::parse(".tileHeadline, a").unwrap();
    let link_selector = Selector::parse("a").unwrap();
    let date_selector = Selector::parse(".documentByLine, .tileInfo").unwrap();
    let desc_selector = Selector::parse(".tileDescription, .description").unwrap();

    let mut scraped_items = vec![];

    for tile in document.select(&tile_selector) {
        let headline_el = match tile.select(&headline_selector).next() {
            Some(el) => el,
            None => continue,
        };

        let link_el = if headline_el.value().name() == "a" {
            headline_el
        } else {
            match headline_el.select(&link_selector).next() {
                Some(el) => el,
                None => continue,
            }
        };

        let title = clean_text(&link_el.text().collect::<Vec<_>>().join(""));
        let link = link_el.value().attr("href").unwrap_or("").to_string();

        let date_str = match tile.select(&date_selector).next() {
            Some(el) => clean_text(&el.text().collect::<Vec<_>>().join("")),
            None => "".to_string(),
        };

        let pub_date = parse_date(&date_str);

        let summary = match tile.select(&desc_selector).next() {
            Some(el) => clean_text(&el.text().collect::<Vec<_>>().join("")),
            None => "Novidade publicada no portal de notícias da PREVIC.".to_string(),
        };

        let keywords = vec!["resolução", "portaria", "instrução", "decreto", "lei", "cnpc", "previc", "norma", "regra", "tabela", "atuarial", "investimento"];
        let is_relevant = keywords.iter().any(|&kw| title.to_lowercase().contains(kw) || summary.to_lowercase().contains(kw));

        if is_relevant {
            let mut doc_type = "Notícia".to_string();
            if title.to_lowercase().contains("resolução") {
                doc_type = "Resolução".to_string();
            } else if title.to_lowercase().contains("portaria") {
                doc_type = "Portaria".to_string();
            } else if title.to_lowercase().contains("decreto") {
                doc_type = "Decreto".to_string();
            } else if title.to_lowercase().contains("lei") {
                doc_type = "Lei".to_string();
            }

            let mut impact = "Baixo".to_string();
            let high_terms = vec!["investimento", "atuarial", "portabilidade", "carência", "taxa"];
            let medium_terms = vec!["segurança", "fiscalização", "reajuste", "governança"];
            
            if high_terms.iter().any(|&term| title.to_lowercase().contains(term) || summary.to_lowercase().contains(term)) {
                impact = "Alto".to_string();
            } else if medium_terms.iter().any(|&term| title.to_lowercase().contains(term) || summary.to_lowercase().contains(term)) {
                impact = "Médio".to_string();
            }

            let mut slug = title.to_lowercase();
            slug = slug.chars().map(|c| if c.is_alphanumeric() { c } else { '-' }).collect();
            let re_dash = Regex::new(r"-+").unwrap();
            slug = re_dash.replace_all(&slug, "-").trim_matches('-').to_string();
            if slug.len() > 30 {
                slug = slug[..30].to_string();
            }
            let doc_id = format!("scraped-{}-{}", slug, pub_date.replace('-', ""));

            scraped_items.append(&mut vec![LegislationItem {
                id: doc_id,
                title,
                date: pub_date.clone(),
                effective_date: pub_date,
                source: "PREVIC".to_string(),
                doc_type,
                impact,
                areas: vec!["Regulatório".to_string(), "Previdência".to_string()],
                details: format!("Item detectado pelo monitor automático de legislação. Publicação oficial disponível no link de origem.\n\nResumo detalhado: {}", summary),
                summary,
                official_link: link,
                diff: None,
            }]);
        }
    }

    println!("Varredura finalizada. Encontrados {} itens relevantes do setor.", scraped_items.len());
    scraped_items
}

fn main() {
    let db_path = Path::new(DATABASE_FILE);
    if !db_path.exists() {
        println!("Erro: Arquivo {} não encontrado.", DATABASE_FILE);
        return;
    }

    let content = match fs::read_to_string(db_path) {
        Ok(c) => c,
        Err(e) => {
            println!("Erro ao ler o arquivo de banco de dados: {}", e);
            return;
        }
    };

    let start_idx = match content.find('[') {
        Some(idx) => idx,
        None => {
            println!("Erro: Não foi possível localizar o início do array no banco de dados.");
            return;
        }
    };

    let end_idx = match content.rfind(']') {
        Some(idx) => idx + 1,
        None => {
            println!("Erro: Não foi possível localizar o fim do array no banco de dados.");
            return;
        }
    };

    let json_str = &content[start_idx..end_idx];
    let mut current_data: Vec<LegislationItem> = match serde_json::from_str(json_str) {
        Ok(data) => data,
        Err(e) => {
            println!("Erro ao analisar o JSON do banco de dados: {}", e);
            return;
        }
    };

    let scraped_data = scrape_previc_news();
    let mut new_added_count = 0;
    
    let existing_ids: std::collections::HashSet<String> = current_data.iter().map(|item| item.id.clone()).collect();

    for item in scraped_data {
        if !existing_ids.contains(&item.id) {
            println!("Adicionando novo item: {}", item.title);
            current_data.insert(0, item);
            new_added_count += 1;
        }
    }

    if new_added_count > 0 {
        let new_json_str = serde_json::to_string_pretty(&current_data).unwrap();
        let updated_content = format!(
            "// Base de dados padrão (normas reais de 2025/2026)\n\
             // Este arquivo é atualizado automaticamente pelo script de scraping diário.\n\n\
             export interface LegislationDiff {{\n  \
               targetArticle: string;\n  \
               oldText: string;\n  \
               newText: string;\n\
             }}\n\n\
             export interface LegislationItem {{\n  \
               id: string;\n  \
               title: string;\n  \
               date: string;\n  \
               effectiveDate: string;\n  \
               source: string;\n  \
               type: string;\n  \
               impact: 'Alto' | 'Médio' | 'Baixo';\n  \
               areas: string[];\n  \
               summary: string;\n  \
               details: string;\n  \
               officialLink: string;\n  \
               diff?: LegislationDiff;\n\
             }}\n\n\
             export const DEFAULT_LEGISLATIONS: LegislationItem[] = {};\n",
            new_json_str
        );

        if let Err(e) = fs::write(db_path, updated_content) {
            println!("Erro ao escrever o banco de dados updated: {}", e);
        } else {
            println!("Processo concluído com sucesso. {} novos normativos integrados ao Radar!", new_added_count);
        }
    } else {
        println!("Nenhuma nova legislação detectada hoje. Base de dados atualizada.");
    }
}
