#!/usr/bin/env python3
"""Main entry point for URL rewriter."""

import sys
from .logger import init_logger
from .url_transformer import transform_url

logger = init_logger()

def process_line(line):
    """Process a single input line."""
    try:
        parts = line.split()
        if len(parts) < 2:
            return None

        channel = parts[0]
        url = parts[1]
        return transform_url(url, channel)

    except Exception as e:
        logger.error(f"Error processing line: {str(e)}")
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
            logger.error(f"Fatal error: {str(e)}")
            break

if __name__ == "__main__":
    main()