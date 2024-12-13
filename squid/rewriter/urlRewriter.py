#!/usr/bin/env python3
import sys
import re
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

class UrlRewriter:
    def __init__(self):
        self.static_pattern = re.compile(r'\.(jpg|jpeg|png|gif|css|js|ico|woff|woff2|ttf|svg)(\?|$)')
        
    def is_static_resource(self, url):
        return bool(self.static_pattern.search(url))
        
    def rewrite_url(self, url, channel=None):
        try:
            parsed = urlparse(url)
            
            # No reescribir recursos estáticos
            if self.is_static_resource(parsed.path):
                return url
                
            # Aquí puedes agregar lógica específica de reescritura
            # basada en el canal o la plataforma
                
            return url
        except:
            return url

class RequestProcessor:
    def __init__(self):
        self.rewriter = UrlRewriter()
        
    def process_line(self, line):
        try:
            parts = line.strip().split()
            if not parts:
                return None
                
            url = parts[0]
            channel_id = parts[1] if len(parts) > 1 else None
            
            return self.rewriter.rewrite_url(url, channel_id)
        except Exception as e:
            sys.stderr.write(f"Error processing line: {str(e)}\n")
            return None

def main():
    processor = RequestProcessor()
    
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
                
            result = processor.process_line(line)
            if result:
                sys.stdout.write(f"{result}\n")
                sys.stdout.flush()
            
        except Exception as e:
            sys.stderr.write(f"Error: {str(e)}\n")
            sys.stderr.flush()
            continue

if __name__ == "__main__":
    main()