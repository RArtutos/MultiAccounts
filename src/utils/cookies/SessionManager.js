import { CookieJar } from './CookieJar.js';

export class SessionManager {
  constructor() {
    this.cookieJar = new CookieJar();
    this.sessions = new Map();
  }

  createSession(accountId, domain) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessions.set(sessionId, {
      accountId,
      domain,
      createdAt: new Date(),
      lastAccess: new Date()
    });
    return sessionId;
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastAccess = new Date();
    }
    return session;
  }

  updateSession(sessionId, cookies) {
    const session = this.getSession(sessionId);
    if (session) {
      cookies.forEach((cookie) => {
        this.cookieJar.set(session.domain, cookie.name, cookie.value, cookie.options);
      });
    }
  }

  getSessionCookies(sessionId) {
    const session = this.getSession(sessionId);
    if (!session) return [];
    return this.cookieJar.getAll(session.domain);
  }
}