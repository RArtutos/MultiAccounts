export class CookieDebugger {
  static logCookie(stage, data) {
    console.log(`[Cookie Debug] ${stage}:`, {
      timestamp: new Date().toISOString(),
      ...data
    });
  }

  static logError(stage, error, context = {}) {
    console.error(`[Cookie Error] ${stage}:`, {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      ...context
    });
  }
}