#!/usr/bin/env python3
import sys
import re
import os

def rewrite_url(url):
    # Patrones para URLs de streaming
    streaming_patterns = {
        r'netflix\.com': 'https://www.netflix.com',
        r'hbomax\.com': 'https://www.hbomax.com',
        r'disneyplus\.com': 'https://www.disneyplus.com',
        r'primevideo\.com': 'https://www.primevideo.com'
    }
    
    # Verificar si la URL coincide con algún patrón de streaming
    for pattern, base_url in streaming_patterns.items():
        if re.search(pattern, url, re.IGNORECASE):
            # Asegurar que la URL use HTTPS y el dominio correcto
            path = re.sub(r'^https?://[^/]+', '', url)
            return f"{base_url}{path}"
    
    # Para otras URLs, mantener la URL original
    return url

def main():
    while True:
        try:
            line = sys.stdin.readline().strip()
            if not line:
                break
                
            parts = line.split()
            if len(parts) < 2:
                continue
                
            channel_id, url = parts[0], parts[1]
            
            # Reescribir URL
            new_url = rewrite_url(url)
            
            # Imprimir resultado con el proxy mexicano
            print(f"{channel_id} {new_url}")
            sys.stdout.flush()
            
        except Exception as e:
            sys.stderr.write(f"Error: {str(e)}\n")
            sys.stderr.flush()
            continue

if __name__ == "__main__":
    main()