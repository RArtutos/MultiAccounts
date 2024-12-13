import { parse } from 'cookie';

/**
 * Parses a cookie header string into structured cookie objects
 * @param {string} cookieHeader - Raw cookie header string
 * @returns {Array<Cookie>}
 */
export function parseCookieHeader(cookieHeader) {
  if (!cookieHeader) return [];

  try {
    const [mainPart, ...directives] = cookieHeader.split(';');
    const parsed = parse(mainPart);
    
    return Object.entries(parsed).map(([name, value]) => {
      const options = {};
      
      // Parse cookie directives
      directives.forEach(directive => {
        const [key, val] = directive.trim().split('=');
        const normalizedKey = key.toLowerCase();
        
        switch (normalizedKey) {
          case 'expires':
            options.expires = new Date(val);
            break;
          case 'max-age':
            options.maxAge = parseInt(val, 10);
            break;
          case 'domain':
          case 'path':
            options[normalizedKey] = val;
            break;
          case 'secure':
          case 'httponly':
            options[normalizedKey] = true;
            break;
          case 'samesite':
            options.sameSite = val;
            break;
        }
      });

      return { name, value, options };
    });
  } catch (error) {
    console.error('Error parsing cookie header:', error);
    return [];
  }
}