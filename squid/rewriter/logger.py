"""Logging configuration for URL rewriter."""

import logging
from .constants import LOG_FILE, LOG_FORMAT, LOG_LEVEL

def init_logger():
    """Initialize and configure the logger."""
    logging.basicConfig(
        filename=LOG_FILE,
        level=getattr(logging, LOG_LEVEL),
        format=LOG_FORMAT
    )
    return logging.getLogger('url_rewriter')