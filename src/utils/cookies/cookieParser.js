export function parseCookieString(cookieString) {
  if (!cookieString) return [];
  
  return cookieString.split(';')
    .map(pair => pair.trim())
    .filter(Boolean)
    .map(pair => {
      const [name, ...rest] = pair.split('=');
      const value = rest.join('='); // Handle values that may contain =
      return { name: name.trim(), value: value.trim() };
    })
    .filter(cookie => cookie.name && cookie.value);
}

export function validateCookie(cookie) {
  if (!cookie.name || !cookie.value) {
    return false;
  }

  // Check for invalid characters in name
  if (/[^\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]/.test(cookie.name)) {
    return false;
  }

  // Check domain if present
  if (cookie.domain) {
    if (!/^[a-zA-Z0-9]|^\.[a-zA-Z0-9]/.test(cookie.domain)) {
      return false;
    }
  }

  return true;
}