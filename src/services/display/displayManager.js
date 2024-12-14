import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class DisplayManager {
  constructor() {
    this.displays = new Map();
  }

  async createDisplay(accountId) {
    const displayNum = 99 + parseInt(accountId);
    const display = `:${displayNum}`;

    try {
      // Iniciar Xvfb
      await execAsync(`Xvfb ${display} -screen 0 1920x1080x24 -ac`);
      
      // Iniciar gestor de ventanas
      await execAsync(`DISPLAY=${display} fluxbox &`);
      
      // Iniciar x11vnc
      const vncPort = 5900 + parseInt(accountId);
      await execAsync(`x11vnc -display ${display} -forever -shared -rfbport ${vncPort} &`);

      this.displays.set(accountId, {
        display,
        vncPort
      });

      return { display, vncPort };
    } catch (error) {
      console.error(`Error creating display for account ${accountId}:`, error);
      throw error;
    }
  }

  async getDisplay(accountId) {
    if (!this.displays.has(accountId)) {
      return this.createDisplay(accountId);
    }
    return this.displays.get(accountId);
  }

  async closeDisplay(accountId) {
    const display = this.displays.get(accountId);
    if (display) {
      try {
        await execAsync(`pkill -f "Xvfb ${display.display}"`);
        await execAsync(`pkill -f "x11vnc.*${display.vncPort}"`);
        await execAsync(`pkill -f "fluxbox.*${display.display}"`);
        this.displays.delete(accountId);
      } catch (error) {
        console.error(`Error closing display for account ${accountId}:`, error);
      }
    }
  }

  async closeAll() {
    for (const accountId of this.displays.keys()) {
      await this.closeDisplay(accountId);
    }
  }
}

export const displayManager = new DisplayManager();