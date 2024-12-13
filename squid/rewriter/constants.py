"""Constants for URL rewriter."""

# Static file patterns
STATIC_FILE_EXTENSIONS = (
    'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'css', 'js',
    'woff', 'woff2', 'ttf', 'eot', 'ico', 'mp4', 'webm'
)

# Logging configuration
LOG_FILE = '/var/log/squid/url_rewriter.log'
LOG_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'
LOG_LEVEL = 'INFO'

# URL patterns
ACCOUNT_URL_PATTERN = r'/stream/([^/]+)/'