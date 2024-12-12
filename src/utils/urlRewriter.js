export function rewriteUrls(html, account, targetDomain) {
  const urlAttributes = ['href', 'src', 'action', 'data-url', 'content'];
  const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  
  // Replace absolute URLs
  urlAttributes.forEach(attr => {
    const regex = new RegExp(`${attr}=["'](https?:\/\/${targetDomain}[^"']*?)["']`, 'gi');
    html = html.replace(regex, `${attr}="${accountPrefix}$1"`);
  });

  // Replace relative URLs
  urlAttributes.forEach(attr => {
    const relativeRegex = new RegExp(`${attr}=["'](\/?[^"'http][^"']*?)["']`, 'gi');
    html = html.replace(relativeRegex, (match, url) => {
      if (url.startsWith('//')) return match;
      return `${attr}="${accountPrefix}/${url.replace(/^\//, '')}"`;
    });
  });

  // Replace meta refresh URLs
  html = html.replace(
    /content=["'](\d*;\s*URL=)(https?:\/\/[^"']*|\/[^"']*)["']/gi,
    (match, prefix, url) => {
      if (url.includes(targetDomain) || url.startsWith('/')) {
        const newUrl = url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '');
        return `content="${prefix}${accountPrefix}/${newUrl}"`;
      }
      return match;
    }
  );

  // Replace JavaScript URLs
  html = html.replace(
    /window\.location\.href\s*=\s*["'](https?:\/\/[^"']*|\/[^"']*)["']/gi,
    (match, url) => {
      if (url.includes(targetDomain) || url.startsWith('/')) {
        const newUrl = url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '');
        return `window.location.href="${accountPrefix}/${newUrl}"`;
      }
      return match;
    }
  );

  return html;
}