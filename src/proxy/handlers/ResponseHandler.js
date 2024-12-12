export class ResponseHandler {
  handle(proxyRes, req, res, account) {
    if (res.headersSent) {
      console.warn('Headers already sent');
      return;
    }

    try {
      this.copyHeaders(proxyRes, res);
      this.updateStats(account);
    } catch (error) {
      console.error('Error handling response:', error);
    }
  }

  copyHeaders(proxyRes, res) {
    const excludedHeaders = ['content-length', 'transfer-encoding'];
    
    Object.entries(proxyRes.headers)
      .filter(([key]) => !excludedHeaders.includes(key.toLowerCase()))
      .forEach(([key, value]) => {
        res.setHeader(key, value);
      });
  }

  updateStats(account) {
    if (!account.stats) {
      account.stats = {
        totalAccesses: 0,
        lastAccess: null,
        peakConcurrentUsers: 0
      };
    }

    account.stats.totalAccesses++;
    account.stats.lastAccess = new Date().toISOString();
  }
}