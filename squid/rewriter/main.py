#!/usr/bin/env python3

import sys
import re
from urllib.parse import urlparse, quote

# Static file patterns
STATIC_FILE_EXTENSIONS = (
    'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'css', 'js',
    'woff', 'woff2', 'ttf', 'eot', 'ico', 'mp4', 'webm'
)

def is_static_resource(url):
    """Check if URL points to a static resource."""
    return bool(re.search(r'\.(' + '|'.join(STATIC_FILE_EXTENSIONS) + r')(\?.*)?$', url, re.I))

def process_line(line):
    """Process a single input line."""
    try:
        parts = line.split()
        if len(parts) < 2:
            return None

        channel = parts[0]
        url = parts[1]
        
        # No rewrite static resources
        if is_static_resource(url):
            return url

        # Extract account name from URL if present
        match = re.search(r'/stream/([^/]+)/', url)
        if match:
            account = quote(match.group(1))
            return f"/stream/{account}{url}"
            
        return url

    except Exception as e:
        sys.stderr.write(f"Error processing line: {str(e)}\n")
        return None

def main():
    """Main execution loop."""
    while True:
        try:
            line = sys.stdin.readline().strip()
            if not line:
                break

            result = process_line(line)
            print(result if result else line)
            sys.stdout.flush()

        except Exception as e:
            sys.stderr.write(f"Fatal error: {str(e)}\n")
            break

if __name__ == "__main__":
    main()