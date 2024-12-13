#!/usr/bin/env python3
import sys
import re
import os

def rewrite_url(url, host=None):
    # Streaming service patterns
    streaming_patterns = {
        r'netflix\.com': 'https://www.netflix.com',
        r'hbomax\.com': 'https://www.hbomax.com',
        r'disneyplus\.com': 'https://www.disneyplus.com',
        r'primevideo\.com': 'https://www.primevideo.com'
    }
    
    try:
        # If URL starts with just '/', it's a relative path
        if url.startswith('/'):
            # Use host header to determine the target service
            if host:
                for pattern, base_url in streaming_patterns.items():
                    if re.search(pattern, host, re.IGNORECASE):
                        return f"{base_url}{url}"
            # Default to Netflix if no match
            return f"https://www.netflix.com{url}"
        
        # For absolute URLs, rewrite if needed
        for pattern, base_url in streaming_patterns.items():
            if re.search(pattern, url, re.IGNORECASE):
                path = re.sub(r'^https?://[^/]+', '', url)
                return f"{base_url}{path}"
        
        return url
    except Exception as e:
        sys.stderr.write(f"Error rewriting URL: {str(e)}\n")
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
                
            channel_id = parts[0]
            url = parts[1]
            host = None
            
            # Check for X-Forwarded-Host or Host header
            if len(parts) > 2:
                for part in parts[2:]:
                    if part.startswith('Host:'):
                        host = part.split(':', 1)[1]
                        break
            
            # Rewrite URL
            new_url = rewrite_url(url, host)
            
            # Output result
            print(f"{channel_id} {new_url}")
            sys.stdout.flush()
            
        except Exception as e:
            sys.stderr.write(f"Error: {str(e)}\n")
            sys.stderr.flush()
            continue

if __name__ == "__main__":
    main()