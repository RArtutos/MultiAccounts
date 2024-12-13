export class CookieManager {
  constructor(account) {
    this.account = account;
  }

  getAccountCookies() {
    if (!this.account.cookies) return '';
    return Object.entries(this.account.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  getHeaders(req) {
    const headers = {
      'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'X-Forwarded-For': req.ip,
      'X-Forwarded-Proto': req.protocol,
      'X-Forwarded-Host': req.get('host')
    };

    const accountCookies = this.getAccountCookies();
    if (accountCookies) {
      headers['Cookie'] = accountCookies;
    }

    return headers;
  }
}