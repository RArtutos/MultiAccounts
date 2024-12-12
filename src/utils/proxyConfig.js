export function createProxyConfig(account, req, targetDomain) {
  const accountPath = `/stream/${encodeURIComponent(account.name)}`;
  
  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    cookieDomainRewrite: {
      [targetDomain]: req.get('host')
    },
    pathRewrite: (path, req) => {
      // Remove the /stream/accountName prefix
      return path.startsWith(accountPath) 
        ? path.slice(accountPath.length) || '/'
        : path;
    },
    headers: {
      'X-Forwarded-For': req.ip,
      'X-Forwarded-Proto': req.protocol,
      'X-Forwarded-Host': req.get('host'),
      ...(account.cookies && {
        'Cookie': Object.entries(account.cookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ')
      })
    }
  };
}