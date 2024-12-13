export class UrlRewriter {
  rewritePath(path, req, account) {
    const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
    
    // If path doesn't start with our prefix, return as is
    if (!path.startsWith(accountPrefix)) {
      return path;
    }

    // Remove the account prefix to get the original path
    const originalPath = path.slice(accountPrefix.length) || '/';
    
    // Store the original path in the request for later use
    req.originalPath = originalPath;
    
    return originalPath;
  }

  rewriteUrl(url, account, currentPath = '/') {
    if (!url) return url;

    const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
    
    // Don't rewrite if already has our prefix
    if (url.startsWith(accountPrefix)) {
      return url;
    }

    try {
      // Handle absolute URLs
      if (url.startsWith('http') || url.startsWith('//')) {
        const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
        const targetDomain = new URL(account.url).hostname;
        
        if (urlObj.hostname === targetDomain) {
          return `${accountPrefix}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
        }
        return url;
      }

      // Handle absolute paths
      if (url.startsWith('/')) {
        return `${accountPrefix}${url}`;
      }

      // Handle relative paths
      const base = new URL(account.url);
      const resolvedUrl = new URL(url, `${base.origin}${currentPath}`);
      return `${accountPrefix}${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
    } catch (error) {
      console.error('Error rewriting URL:', error);
      return url;
    }
  }
}