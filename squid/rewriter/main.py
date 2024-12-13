#!/usr/bin/env python3
import sys
import re
from urllib.parse import urlparse, parse_qs, urljoin

def is_static_resource(url):
    """Check if URL points to a static resource."""
    static_patterns = r'\.(jpg|jpeg|png|gif|css|js|ico|woff2?|ttf|svg|webp)(\?|$)'
    return bool(re.search(static_patterns, url, re.I))

def rewrite_url(url, account_prefix=None):
    """Rewrite URL according to rules."""
    try:
        if not url or url.startswith('/'):
            return url

        parsed = urlparse(url)
        
        # Don't rewrite static resources
        if is_static_resource(parsed.path):
            return url

        # Only rewrite if we have an account prefix
        if account_prefix:
            new_path = f'/stream/{account_prefix}{parsed.path}'
            if parsed.query:
                new_path = f'{new_path}?{parsed.query}'
            return new_path

        return url
    except Exception as e:
        sys.stderr.write(f'Error rewriting URL: {e}\n')
        return url

def main():
    """Main URL rewriter loop."""
    while True:
        try:
            # Read a line from stdin
            line = sys.stdin.readline().strip()
            if not line:
                break

            # Parse input line
            parts = line.split()
            if len(parts) < 2:
                continue

            url = parts[0]
            channel_id = parts[1]

            # Get account prefix if available
            account_prefix = parts[2] if len(parts) > 2 else None

            # Rewrite URL
            new_url = rewrite_url(url, account_prefix)
            
            # Write result to stdout
            sys.stdout.write(f'{new_url} {channel_id}\n')
            sys.stdout.flush()

        except Exception as e:
            sys.stderr.write(f'Error processing line: {e}\n')
            continue

if __name__ == '__main__':
    main()