import os
import re
import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime

# URLs oficiais para monitoramento
PREVIC_NEWS_URL = "https://www.gov.br/previc/pt-br/assuntos/noticias"
DATABASE_FILE = os.path.join(os.path.dirname(__file__), "src", "data", "database.ts")

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def clean_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def parse_date(date_str):
    # Converte datas como "17/06/2026 15h12" ou "17/06/2026" para "2026-06-17"
    if not date_str:
        return datetime.today().strftime('%Y-%m-%d')
    
    match = re.search(r'(\d{2})/(\d{2})/(\d{4})', date_str)
    if match:
        day, month, year = match.groups()
        return f"{year}-{month}-{day}"
    
    return datetime.today().strftime('%Y-%m-%d')

def scrape_previc_news():
    print(f"Buscando atualizações em: {PREVIC_NEWS_URL}...")
    try:
        response = requests.get(PREVIC_NEWS_URL, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"Erro ao acessar o portal (Código {response.status_code})")
            return []
    except Exception as e:
        print(f"Falha de conexão com o portal PREVIC: {e}")
        return []
    
    soup = BeautifulSoup(response.text, 'html.parser')
    tiles = soup.find_all(class_='tileItem')
    scraped_items = []
    
    for tile in tiles:
        # 1. Extração do título e link
        headline_el = tile.find(class_='tileHeadline') or tile.find('a')
        if not headline_el:
            continue
        
        link_el = headline_el.find('a') if headline_el.name != 'a' else headline_el
        if not link_el:
            continue
            
        title = clean_text(link_el.get_text())
        link = link_el.get('href', '')
        
        # 2. Extração da data de publicação
        date_el = tile.find(class_='documentByLine') or tile.find(class_='tileInfo')
        date_str = ""
        if date_el:
            date_str = clean_text(date_el.get_text())
        
        pub_date = parse_date(date_str)
        
        # 3. Extração do resumo descritivo
        desc_el = tile.find(class_='tileDescription') or tile.find(class_='description')
        summary = clean_text(desc_el.get_text()) if desc_el else "Novidade publicada no portal de notícias da PREVIC."
        
        # Filtro de palavras-chave para focar em regulação/fiscalização/leis
        keywords = ["resolução", "portaria", "instrução", "decreto", "lei", "cnpc", "previc", "norma", "regra", "tabela", "atuarial", "investimento"]
        is_relevant = any(kw in title.lower() or kw in summary.lower() for kw in keywords)
        
        if is_relevant:
            # Define o tipo de documento
            doc_type = "Notícia"
            if "resolução" in title.lower():
                doc_type = "Resolução"
            elif "portaria" in title.lower():
                doc_type = "Portaria"
            elif "decreto" in title.lower():
                doc_type = "Decreto"
            elif "lei" in title.lower():
                doc_type = "Lei"
                
            # Define o impacto estimado baseado em termos-chave
            impact = "Baixo"
            if any(term in title.lower() or term in summary.lower() for term in ["investimento", "atuarial", "portabilidade", "carência", "taxa"]):
                impact = "Alto"
            elif any(term in title.lower() or term in summary.lower() for term in ["segurança", "fiscalização", "reajuste", "governança"]):
                impact = "Médio"
                
            # Gera um ID baseado na URL ou no título
            slug = re.sub(r'[^a-z0-9]', '-', title.lower())
            slug = re.sub(r'-+', '-', slug).strip('-')
            doc_id = f"scraped-{slug[:30]}-{pub_date.replace('-', '')}"
            
            scraped_items.append({
                "id": doc_id,
                "title": title,
                "date": pub_date,
                "effectiveDate": pub_date,
                "source": "PREVIC",
                "type": doc_type,
                "impact": impact,
                "areas": ["Regulatório", "Previdência"],
                "summary": summary,
                "details": f"Item detectado pelo monitor automático de legislação. Publicação oficial disponível no link de origem.\n\nResumo detalhado: {summary}",
                "officialLink": link
            })
            
    print(f"Varredura finalizada. Encontrados {len(scraped_items)} itens relevantes do setor.")
    return scraped_items

def update_database():
    if not os.path.exists(DATABASE_FILE):
        print(f"Erro: Arquivo {DATABASE_FILE} não encontrado.")
        return
        
    # Carrega dados do arquivo database.ts existente
    with open(DATABASE_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Localiza o array JSON no arquivo TS
    start_idx = content.find('[')
    end_idx = content.rfind(']') + 1
    
    if start_idx == -1 or end_idx == 0:
        print("Erro: Não foi possível localizar o array de legislações no database.ts.")
        return
        
    json_str = content[start_idx:end_idx]
    try:
        current_data = json.loads(json_str)
    except Exception as e:
        print(f"Erro ao analisar o JSON do banco de dados: {e}")
        return
        
    scraped_data = scrape_previc_news()
    new_added_count = 0
    
    # Adiciona itens que ainda não existem
    existing_ids = {item['id'] for item in current_data}
    
    for item in scraped_data:
        if item['id'] not in existing_ids:
            current_data.insert(0, item) # Adiciona no início do feed
            existing_ids.add(item['id'])
            new_added_count += 1
            print(f"Adicionando novo item: {item['title']}")
            
    if new_added_count > 0:
        # Grava de volta no formato TypeScript
        new_json_str = json.dumps(current_data, indent=2, ensure_ascii=False)
        updated_content = (
            "// Base de dados padrão (normas reais de 2025/2026)\n"
            "// Este arquivo é atualizado automaticamente pelo script de scraping diário.\n\n"
            "export interface LegislationDiff {\n"
            "  targetArticle: string;\n"
            "  oldText: string;\n"
            "  newText: string;\n"
            "}\n\n"
            "export interface LegislationItem {\n"
            "  id: string;\n"
            "  title: string;\n"
            "  date: string;\n"
            "  effectiveDate: string;\n"
            "  source: string;\n"
            "  type: string;\n"
            "  impact: 'Alto' | 'Médio' | 'Baixo';\n"
            "  areas: string[];\n"
            "  summary: string;\n"
            "  details: string;\n"
            "  officialLink: string;\n"
            "  diff?: LegislationDiff;\n"
            "}\n\n"
            f"export const DEFAULT_LEGISLATIONS: LegislationItem[] = {new_json_str};\n"
        )
        
        with open(DATABASE_FILE, 'w', encoding='utf-8') as f:
            f.write(updated_content)
            
        print(f"Processo concluído com sucesso. {new_added_count} novos normativos integrados ao Radar!")
    else:
        print("Nenhuma nova legislação detectada hoje. Base de dados atualizada.")

if __name__ == "__main__":
    update_database()
