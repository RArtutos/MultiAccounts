import { EventEmitter } from 'events';

class CookieStore extends EventEmitter {
  constructor() {
    super();
    this.cookies = new Map();
  }

  set(accountId, name, value, options = {}) {
    if (!this.cookies.has(accountId)) {
      this.cookies.set(accountId, new Map());
    }
    
    const accountCookies = this.cookies.get(accountId);
    accountCookies.set(name, { value, options });
    
    this.emit('cookieUpdated', { accountId, name, value, options });
  }

  get(accountId, name) {
    return this.cookies.get(accountId)?.get(name);
  }

  getAll(accountId) {
    return Array.from(this.cookies.get(accountId)?.entries() || []);
  }

  delete(accountId, name) {
    const accountCookies = this.cookies.get(accountId);
    if (accountCookies) {
      accountCookies.delete(name);
      this.emit('cookieDeleted', { accountId, name });
    }
  }

  clear(accountId) {
    this.cookies.delete(accountId);
    this.emit('cookiesCleared', { accountId });
  }
}

export const cookieStore = new CookieStore();