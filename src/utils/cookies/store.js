/**
 * Manages cookie storage and persistence
 */
export class CookieStore {
  constructor() {
    this.cookies = new Map();
  }

  /**
   * Stores a cookie with metadata
   * @param {Cookie} cookie - Cookie to store
   */
  set(cookie) {
    const { name, value } = cookie;
    const existing = this.cookies.get(name);
    
    this.cookies.set(name, {
      name,
      value,
      metadata: {
        created: existing?.metadata?.created || new Date(),
        lastUsed: new Date(),
        useCount: (existing?.metadata?.useCount || 0) + 1
      }
    });
  }

  /**
   * Retrieves a stored cookie
   * @param {string} name - Cookie name
   * @returns {CookieStore|null}
   */
  get(name) {
    const cookie = this.cookies.get(name);
    if (cookie) {
      cookie.metadata.lastUsed = new Date();
      cookie.metadata.useCount++;
    }
    return cookie || null;
  }

  /**
   * Gets all stored cookies
   * @returns {Array<CookieStore>}
   */
  getAll() {
    return Array.from(this.cookies.values());
  }

  /**
   * Removes a cookie from storage
   * @param {string} name - Cookie name
   */
  remove(name) {
    this.cookies.delete(name);
  }

  /**
   * Clears all stored cookies
   */
  clear() {
    this.cookies.clear();
  }
}