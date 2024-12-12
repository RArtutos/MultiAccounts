import expressWs from 'express-ws';
import * as accountService from '../services/accountService.js';
import { accountEvents } from '../services/accountService.js';

export function setupWebSocket(app) {
  const wsInstance = expressWs(app);
  const wss = wsInstance.getWss();
  
  // Función para enviar actualizaciones a todos los clientes
  const broadcastUpdate = async () => {
    const { accounts } = await accountService.getAccounts();
    const data = JSON.stringify({ 
      type: 'accountsUpdate', 
      accounts 
    });

    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        try {
          client.send(data);
        } catch (err) {
          console.error('Error sending to client:', err);
        }
      }
    });
  };

  app.ws('/updates', function(ws, req) {
    // Configurar ping/pong para mantener la conexión viva
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    // Enviar estado inicial
    accountService.getAccounts().then(({ accounts }) => {
      ws.send(JSON.stringify({ 
        type: 'accountsUpdate', 
        accounts 
      }));
    }).catch(err => {
      console.error('Error sending initial state:', err);
    });

    // Suscribirse a eventos de actualización
    accountEvents.on('accountsUpdated', broadcastUpdate);

    // Manejar errores y cierre
    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
    });

    ws.on('close', () => {
      accountEvents.removeListener('accountsUpdated', broadcastUpdate);
    });
  });

  // Configurar intervalo de ping para todas las conexiones
  const pingInterval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  // Limpiar intervalo cuando el servidor se cierre
  wss.on('close', () => {
    clearInterval(pingInterval);
  });

  return wsInstance;
}