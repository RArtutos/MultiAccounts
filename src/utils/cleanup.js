import { browserPool } from '../services/browserPool.js';
import { sessionManager } from '../services/sessionManager.js';

export function setupCleanup() {
  // Manejar cierre graceful
  process.on('SIGTERM', async () => {
    console.log('Shutting down...');
    await browserPool.closeAll();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await browserPool.closeAll();
    process.exit(0);
  });

  // Iniciar limpieza automática de sesiones
  sessionManager.startCleanup();
}