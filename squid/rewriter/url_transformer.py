"""URL transformation utilities."""

import re
from urllib.parse import urlparse, quote
from .constants import ACCOUNT_URL_PATTERN
from .url_validator import is_static_resource

def extract_account(url):
    """Extract account name from URL."""
    match = re.search(ACCOUNT_URL_PATTERN, url)
    return quote(match.group(1)) if match else None

def transform_url(url, channel):
    """Transform URL according to rewriting rules."""
    if is_static_resource(url):
        return url

    try:
        parsed = urlparse(url)
        account = extract_account(parsed.path)
        
        if account:
            new_path = f"/stream/{account}{parsed.path}"
            return new_path + (f"?{parsed.query}" if parsed.query else "")
        
        return url
    except Exception:
        return url