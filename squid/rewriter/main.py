#!/usr/bin/env python3
import sys
import re
import json
from urllib.parse import urlparse, parse_qs

def load_accounts():
    try:
        with open('/app/data/accounts.json', 'r') as f:
            return json.load(f)
    except Exception as e:
        sys.stderr.write(f"Error loading accounts: {e}\n")
        return {"accounts": []}

def get_account_by_domain(domain):
    accounts = load_accounts()
    account_name = domain.split('.')[0]
    return next((acc for acc in accounts['accounts'] 
                if acc['name'] == account_name 
                and acc['status'] == 'Available'), None)

def rewrite_url(url, channel):
    try:
        parsed = urlparse(url)
        if not parsed.netloc:
            return f"{url}\n"

        # Extraer dominio del canal
        domain = channel.split(' ')[0]
        account = get_account_by_domain(domain)
        
        if not account:
            return f"{url}\n"

        # Reescribir URL según el servicio
        target_domain = urlparse(account['url']).netloc
        if target_domain in parsed.netloc:
            return f"{url}\n"
            
        return f"{account['url']}{parsed.path}{parsed.query}\n"
    except Exception as e:
        sys.stderr.write(f"Error rewriting URL: {e}\n")
        return f"{url}\n"

def main():
    while True:
        try:
            line = sys.stdin.readline().strip()
            if not line:
                break

            parts = line.split(' ')
            if len(parts) < 2:
                print(line)
                continue

            url = parts[0]
            channel = ' '.join(parts[1:])
            sys.stdout.write(rewrite_url(url, channel))
            sys.stdout.flush()
        except Exception as e:
            sys.stderr.write(f"Error processing line: {e}\n")
            sys.stdout.write(f"{line}\n")
            sys.stdout.flush()

if __name__ == "__main__":
    main()