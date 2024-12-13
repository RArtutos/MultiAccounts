/**
 * @typedef {Object} Cookie
 * @property {string} name - Cookie name
 * @property {string} value - Cookie value
 * @property {Object} options - Cookie options
 * @property {string} [options.domain] - Cookie domain
 * @property {string} [options.path] - Cookie path
 * @property {boolean} [options.secure] - Secure flag
 * @property {boolean} [options.httpOnly] - HttpOnly flag
 * @property {string} [options.sameSite] - SameSite policy
 * @property {Date} [options.expires] - Expiration date
 * @property {number} [options.maxAge] - Max age in seconds
 */

/**
 * @typedef {Object} CookieStore
 * @property {string} name - Cookie name
 * @property {string} value - Cookie value
 * @property {Object} metadata - Cookie metadata
 * @property {Date} metadata.created - Creation date
 * @property {Date} metadata.lastUsed - Last usage date
 * @property {number} metadata.useCount - Number of times used
 */

export const COOKIE_DEFAULTS = {
  path: '/',
  secure: false,
  httpOnly: false,
  sameSite: 'none'
};