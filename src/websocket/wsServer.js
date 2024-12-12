import expressWs from 'express-ws';
import * as accountService from '../services/accountService.js';
import { accountEvents } from '../services/accountService.js';

export function setupWebSocket(app) {
  const wsInstance = expressWs(app);
  const wss = wsInstance.getWss();
  const clients = new Set();
  
  // Función para enviar actualizaciones a los clientes
  const broadcastUpdate = async () => {
    try {
      const { accounts } = await accountService.getAccounts();
      const data = JSON.stringify({ 
        type: 'accountsUpdate', 
        accounts: accounts.map(account => ({
          ...account,
          status: account.status || 'Unknown'
        }))
      });

      for (const client of clients) {
        try {
          if (client.readyState === 1) { // WebSocket.OPEN
            client.send(data);
          }
        } catch (err) {
          console.error('Error sending to client:', err);
          clients.delete(client);
        }
      }
    } catch (error) {
      console.error('Error broadcasting update:', error);
    }
  };

  // Configurar el endpoint WebSocket
  app.ws('/updates', async function(ws, req) {
    clients.add(ws);
    let isAlive = true;

    const ping = () => {
      if (!isAlive) {
        clients.delete(ws);
        return ws.terminate();
      }
      isAlive = false;
      try {
        ws.ping();
      } catch (error) {
        console.error('Error sending ping:', error);
        clients.delete(ws);
        ws.terminate();
      }
    };

    const interval = setInterval(ping, 30000);

    ws.on('pong', () => {
      isAlive = true;
    });

    // Enviar estado inicial
    try {
      const { accounts } = await accountService.getAccounts();
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ 
          type: 'accountsUpdate', 
          accounts: accounts.map(account => ({
            ...account,
            status: account.status || 'Unknown'
          }))
        }));
      }
    } catch (err) {
      console.error('Error sending initial state:', err);
    }

    // Suscribirse a actualizaciones
    const updateListener = () => {
      if (ws.readyState === 1) {
        broadcastUpdate().catch(console.error);
      }
    };

    accountEvents.on('accountsUpdated', updateListener);

    // Manejar errores y cierre
    ws.on('error', () => {
      clients.delete(ws);
      clearInterval(interval);
    });

    ws.on('close', () => {
      clients.delete(ws);
      clearInterval(interval);
      accountEvents.removeListener('accountsUpdated', updateListener);
    });
  });

  return wsInstance;
}