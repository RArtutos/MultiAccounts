import { serialize } from 'cookie';
import { COOKIE_DEFAULTS } from './types.js';

/**
 * Serializes a cookie object into a cookie header string
 * @param {Cookie} cookie - Cookie object to serialize
 * @returns {string}
 */
export function serializeCookie(cookie) {
  try {
    const { name, value, options = {} } = cookie;
    return serialize(name, value, {
      ...COOKIE_DEFAULTS,
      ...options
    });
  } catch (error) {
    console.error('Error serializing cookie:', error);
    return '';
  }
}

/**
 * Serializes multiple cookies into a single cookie header string
 * @param {Array<Cookie>} cookies - Array of cookie objects
 * @returns {string}
 */
export function serializeCookies(cookies) {
  return cookies
    .map(serializeCookie)
    .filter(Boolean)
    .join('; ');
}