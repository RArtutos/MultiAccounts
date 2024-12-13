#!/usr/bin/env python3
import sys
import re
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

def rewrite_url(url):
    try:
        parsed = urlparse(url)
        
        # Don't rewrite static resources
        if re.search(r'\.(jpg|jpeg|png|gif|css|js|ico|woff|woff2|ttf|svg)(\?|$)', parsed.path):
            return url
            
        # Add any custom URL rewriting logic here
        
        return url
    except:
        return url

def main():
    while True:
        try:
            # Read URL from Squid
            line = sys.stdin.readline().strip()
            if not line:
                break
                
            # Parse the input
            parts = line.split()
            if len(parts) < 1:
                continue
                
            url = parts[0]
            
            # Rewrite the URL
            new_url = rewrite_url(url)
            
            # Send back to Squid
            sys.stdout.write(f"{new_url}\n")
            sys.stdout.flush()
            
        except Exception as e:
            sys.stderr.write(f"Error: {str(e)}\n")
            sys.stderr.flush()
            continue

if __name__ == "__main__":
    main()