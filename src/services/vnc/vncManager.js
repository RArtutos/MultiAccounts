import { VNCServer } from 'node-vnc-server';
import pty from 'node-pty';

export class VNCManager {
  constructor() {
    this.sessions = new Map();
  }

  async createSession(accountId, display) {
    const vncServer = new VNCServer({
      width: 1920,
      height: 1080,
      httpPort: 6080 + parseInt(accountId),
      websocketPort: 6081 + parseInt(accountId),
      display: display
    });

    // Configurar compresión y calidad
    vncServer.setQuality(8); // 0-9, 9 es la mejor calidad
    vncServer.setCompression(6); // 0-9, 9 es la máxima compresión

    // Configurar codificación eficiente
    vncServer.setPreferredEncoding('tight');

    this.sessions.set(accountId, vncServer);
    return vncServer;
  }

  getSession(accountId) {
    return this.sessions.get(accountId);
  }

  async closeSession(accountId) {
    const session = this.sessions.get(accountId);
    if (session) {
      await session.close();
      this.sessions.delete(accountId);
    }
  }
}