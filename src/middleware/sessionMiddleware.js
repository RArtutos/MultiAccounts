import { SessionManager } from '../utils/cookies/SessionManager.js';

const sessionManager = new SessionManager();

export function sessionMiddleware(req, res, next) {
  const sessionId = req.cookies?.sessionId;
  const session = sessionId ? sessionManager.getSession(sessionId) : null;

  if (!session && req.streamingAccount) {
    const newSessionId = sessionManager.createSession(
      req.streamingAccount.name,
      new URL(req.streamingAccount.url).hostname
    );
    
    res.cookie('sessionId', newSessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    req.session = {
      id: newSessionId,
      isNew: true
    };
  } else if (session) {
    req.session = {
      id: sessionId,
      isNew: false
    };
  }

  next();
}