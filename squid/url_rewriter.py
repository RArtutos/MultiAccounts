#!/usr/bin/env python3
import sys
import re
import os
from urllib.parse import urlparse, quote

def init_logging():
    import logging
    logging.basicConfig(
        filename='/var/log/squid/url_rewriter.log',
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    return logging.getLogger('url_rewriter')

logger = init_logging()

def should_rewrite_url(url):
    # No reescribir recursos estáticos
    static_pattern = r'\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot|ico)(\?.*)?$'
    if re.search(static_pattern, url, re.I):
        return False
    return True

def get_account_from_url(url):
    # Extraer el nombre de la cuenta de la URL
    match = re.search(r'/stream/([^/]+)/', url)
    if match:
        return quote(match.group(1))
    return None

def rewrite_url(url, channel):
    try:
        if not should_rewrite_url(url):
            return url

        parsed = urlparse(url)
        account = get_account_from_url(parsed.path)
        
        if account:
            # Construir la nueva URL con el prefijo de la cuenta
            new_path = f"/stream/{account}{parsed.path}"
            return new_path + (f"?{parsed.query}" if parsed.query else "")
        
        return url
    except Exception as e:
        logger.error(f"Error rewriting URL {url}: {str(e)}")
        return url

def main():
    while True:
        try:
            # Leer la URL de entrada
            line = sys.stdin.readline().strip()
            if not line:
                break

            # Parsear la línea de entrada (formato: channel url extras)
            parts = line.split()
            if len(parts) < 2:
                continue

            channel = parts[0]
            url = parts[1]
            
            # Reescribir la URL
            rewritten_url = rewrite_url(url, channel)
            
            # Enviar la URL reescrita a Squid
            print(rewritten_url)
            sys.stdout.flush()

        except Exception as e:
            logger.error(f"Error processing line: {str(e)}")
            print(url)  # En caso de error, devolver la URL original
            sys.stdout.flush()

if __name__ == "__main__":
    main()