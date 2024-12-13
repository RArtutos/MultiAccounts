import { isInternalUrl } from './urlUtils.js';

export function rewriteUrls(content, account, targetDomain, req) {
  const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  const baseUrl = account.url.replace(/\/$/, '');

  // Helper function to rewrite URLs
  function rewriteUrl(url) {
    if (!url) return url;

    // Don't rewrite URLs for static resources
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot)(\?.*)?$/i)) {
      return url;
    }

    // If URL already has our prefix, don't modify it
    if (url.startsWith(accountPrefix)) {
      return url;
    }

    try {
      // Handle absolute URLs
      if (url.startsWith('http') || url.startsWith('//')) {
        const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
        if (isInternalUrl(url, targetDomain)) {
          return `${accountPrefix}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
        }
        return url;
      }

      // Handle relative URLs
      if (url.startsWith('/')) {
        // Absolute path relative to domain root
        return `${accountPrefix}${url}`;
      } else {
        // Relative path - combine with current path
        const currentPath = req.originalPath || '/';
        const currentDir = currentPath.split('/').slice(0, -1).join('/');
        const resolvedPath = new URL(url, `${baseUrl}${currentDir}/`).pathname;
        return `${accountPrefix}${resolvedPath}`;
      }
    } catch (error) {
      console.error('Error transforming URL:', error);
      return url;
    }
  }

  let modifiedContent = content;

  // Rewrite URLs in HTML attributes
  modifiedContent = modifiedContent.replace(
    /(href|src|action|data-src|poster)=["']([^"']+)["']/gi,
    (match, attr, url) => {
      if (url.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot)(\?.*)?$/i)) {
        return match;
      }
      return `${attr}="${rewriteUrl(url)}"`;
    }
  );

  // Rewrite URLs in meta refresh
  modifiedContent = modifiedContent.replace(
    /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
    (match, prefix, url) => `content="${prefix}${rewriteUrl(url)}"`
  );

  // Rewrite URLs in JavaScript
  const jsPatterns = [
    // Direct redirects
    /(window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
    // Navigation functions
    /(window\.open|location\.replace|location\.assign)\(["']([^"']+)["']/gi,
    // AJAX requests
    /(fetch|axios\.get|axios\.post|\.ajax)\(["']([^"']+)["']/gi
  ];

  jsPatterns.forEach(pattern => {
    modifiedContent = modifiedContent.replace(pattern, (match, func, url) => {
      if (url.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot)(\?.*)?$/i)) {
        return match;
      }
      return `${func}"${rewriteUrl(url)}"`;
    });
  });

  return modifiedContent;
}