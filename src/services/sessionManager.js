import { browserPool } from './browserPool.js';

class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  async createSession(accountId, cookies) {
    const page = await browserPool.getPage(accountId);
    
    if (cookies) {
      await page.context().addCookies(cookies);
    }

    this.sessions.set(accountId, {
      page,
      lastAccess: Date.now()
    });

    return page;
  }

  async getSession(accountId) {
    const session = this.sessions.get(accountId);
    if (session) {
      session.lastAccess = Date.now();
      return session.page;
    }
    return null;
  }

  async clearSession(accountId) {
    const session = this.sessions.get(accountId);
    if (session) {
      await browserPool.closeBrowser(accountId);
      this.sessions.delete(accountId);
    }
  }

  // Limpiar sesiones inactivas cada 30 minutos
  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [accountId, session] of this.sessions.entries()) {
        if (now - session.lastAccess > 30 * 60 * 1000) {
          this.clearSession(accountId);
        }
      }
    }, 5 * 60 * 1000);
  }
}

export const sessionManager = new SessionManager();