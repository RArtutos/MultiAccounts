export const createCookieConfig = (req) => ({
  cookieDomainRewrite: {
    '*': req.get('host')
  },
  cookiePathRewrite: {
    '*': '/'
  }
});