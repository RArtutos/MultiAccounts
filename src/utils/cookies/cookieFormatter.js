export function formatCookie(name, value, domain) {
  return {
    name: String(name),
    value: String(value),
    domain: domain,
    path: '/',
    secure: true,
    sameSite: 'Lax'
  };
}

export function formatCookies(cookiesObj, domain) {
  if (!cookiesObj || typeof cookiesObj !== 'object') {
    return [];
  }

  return Object.entries(cookiesObj)
    .map(([name, value]) => formatCookie(name, value, domain))
    .filter(cookie => cookie.name && cookie.value);
}