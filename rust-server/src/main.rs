use std::fs;
use std::path::{Path, PathBuf};
use tiny_http::{Server, Response, Header};

fn main() {
    let port = 8080;
    let bind_addr = format!("127.0.0.1:{}", port);
    let server = Server::http(&bind_addr).unwrap();
    
    println!("==========================================================");
    println!("   SERVIDOR LOCAL EM RUST ATIVO: http://{}  ", bind_addr);
    println!("==========================================================");
    
    // Identifica o diretório base: se houver "./out", serve dele (Next.js build), caso contrário, do diretório atual.
    let base_path = if Path::new("./out").is_dir() {
        println!("Servindo arquivos da pasta compilada: ./out");
        PathBuf::from("./out")
    } else {
        println!("Servindo arquivos da pasta atual: .");
        PathBuf::from(".")
    };
    
    println!("Pressione CTRL+C nesta janela para encerrar o servidor.");
    println!();

    for request in server.incoming_requests() {
        let url = request.url();
        // Remove query parameters se houver (ex: /index.html?v=2 -> /index.html)
        let clean_url = url.split('?').next().unwrap_or(url);
        
        // Trata a rota root '/'
        let mut file_path = if clean_url == "/" {
            base_path.join("index.html")
        } else {
            // Remove o prefixo '/' para join do path
            let relative_path = clean_url.trim_start_matches('/');
            base_path.join(relative_path)
        };

        // Suporte para Clean URLs (ex: /about -> /about.html)
        if !file_path.exists() && file_path.extension().is_none() {
            let mut html_path = file_path.clone();
            html_path.set_extension("html");
            if html_path.exists() {
                file_path = html_path;
            }
        }

        if file_path.exists() && file_path.is_file() {
            let content_type = match file_path.extension().and_then(|ext| ext.to_str()) {
                Some("html") => "text/html; charset=utf-8",
                Some("css") => "text/css; charset=utf-8",
                Some("js") => "application/javascript; charset=utf-8",
                Some("svg") => "image/svg+xml",
                Some("png") => "image/png",
                Some("jpg") | Some("jpeg") => "image/jpeg",
                Some("ico") => "image/x-icon",
                _ => "application/octet-stream",
            };

            match fs::read(&file_path) {
                Ok(data) => {
                    let mut response = Response::from_data(data);
                    response.add_header(
                        Header::from_bytes(&b"Content-Type"[..], content_type.as_bytes()).unwrap()
                    );
                    println!("[200] {} -> {:?}", clean_url, file_path);
                    let _ = request.respond(response);
                }
                Err(_) => {
                    let response = Response::from_string("Erro ao ler o arquivo").with_status_code(500);
                    println!("[500] {} -> Erro de leitura", clean_url);
                    let _ = request.respond(response);
                }
            }
        } else {
            let response = Response::from_string("Página não encontrada").with_status_code(404);
            println!("[404] {} -> Não Encontrado", clean_url);
            let _ = request.respond(response);
        }
    }
}
