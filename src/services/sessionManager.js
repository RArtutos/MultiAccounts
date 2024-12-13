import { browserPool } from './browserPool.js';

class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  async createSession(accountId, cookies = []) {
    try {
      const page = await browserPool.getPage(accountId, cookies);
      
      this.sessions.set(accountId, {
        page,
        lastAccess: Date.now()
      });

      return page;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async getSession(accountId) {
    const session = this.sessions.get(accountId);
    if (session) {
      session.lastAccess = Date.now();
      return session.page;
    }
    return null;
  }

  async updateSession(accountId, cookies) {
    try {
      await browserPool.updatePageCookies(accountId, cookies);
      const session = this.sessions.get(accountId);
      if (session) {
        session.lastAccess = Date.now();
      }
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async clearSession(accountId) {
    try {
      await browserPool.closeBrowser(accountId);
      this.sessions.delete(accountId);
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  }

  // Limpiar sesiones inactivas cada 30 minutos
  startCleanup() {
    setInterval(async () => {
      const now = Date.now();
      for (const [accountId, session] of this.sessions.entries()) {
        if (now - session.lastAccess > 30 * 60 * 1000) {
          await this.clearSession(accountId);
        }
      }
    }, 5 * 60 * 1000);
  }
}

export const sessionManager = new SessionManager();