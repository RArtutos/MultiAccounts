import expressWs from 'express-ws';
import * as accountService from '../services/accountService.js';
import { accountEvents } from '../services/accountService.js';

export function setupWebSocket(app) {
  const wsInstance = expressWs(app);
  const wss = wsInstance.getWss();
  
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

      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          try {
            client.send(data);
          } catch (err) {
            console.error('Error sending to client:', err);
          }
        }
      });
    } catch (error) {
      console.error('Error broadcasting update:', error);
    }
  };

  app.ws('/updates', async function(ws, req) {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    try {
      const { accounts } = await accountService.getAccounts();
      ws.send(JSON.stringify({ 
        type: 'accountsUpdate', 
        accounts: accounts.map(account => ({
          ...account,
          status: account.status || 'Unknown'
        }))
      }));
    } catch (err) {
      console.error('Error sending initial state:', err);
    }

    accountEvents.on('accountsUpdated', broadcastUpdate);

    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
    });

    ws.on('close', () => {
      accountEvents.removeListener('accountsUpdated', broadcastUpdate);
    });
  });

  const pingInterval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(pingInterval);
  });

  return wsInstance;
}