"""URL validation utilities."""

import re
from urllib.parse import urlparse
from .constants import STATIC_FILE_EXTENSIONS

def is_static_resource(url):
    """Check if URL points to a static resource."""
    pattern = r'\.(' + '|'.join(STATIC_FILE_EXTENSIONS) + r')(\?.*)?$'
    return bool(re.search(pattern, url, re.I))

def is_valid_url(url):
    """Validate URL format."""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False