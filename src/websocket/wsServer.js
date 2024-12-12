import expressWs from 'express-ws';
import * as accountService from '../services/accountService.js';
import { accountEvents } from '../services/accountService.js';

export function setupWebSocket(app) {
  const wsInstance = expressWs(app);
  const wss = wsInstance.getWss();
  
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

      wss.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
          try {
            client.send(data);
          } catch (err) {
            console.error('Error sending to client:', err);
            try {
              client.terminate();
            } catch (termError) {
              console.error('Error terminating client:', termError);
            }
          }
        }
      });
    } catch (error) {
      console.error('Error broadcasting update:', error);
    }
  };

  // Configurar el endpoint WebSocket
  app.ws('/updates', async function(ws, req) {
    let pingTimeout;
    
    const heartbeat = () => {
      clearTimeout(pingTimeout);
      pingTimeout = setTimeout(() => {
        try {
          ws.terminate();
        } catch (error) {
          console.error('Error terminating inactive client:', error);
        }
      }, 35000);
    };

    ws.on('pong', heartbeat);
    heartbeat();

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

    // Manejar errores
    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
      clearTimeout(pingTimeout);
      try {
        ws.terminate();
      } catch (termError) {
        console.error('Error terminating client after error:', termError);
      }
    });

    // Limpieza al cerrar
    ws.on('close', () => {
      clearTimeout(pingTimeout);
      accountEvents.removeListener('accountsUpdated', updateListener);
    });
  });

  // Configurar el intervalo de ping
  const pingInterval = setInterval(() => {
    wss.clients.forEach(ws => {
      try {
        ws.ping();
      } catch (error) {
        console.error('Error sending ping:', error);
        try {
          ws.terminate();
        } catch (termError) {
          console.error('Error terminating client after ping failure:', termError);
        }
      }
    });
  }, 30000);

  // Limpieza al cerrar el servidor
  wss.on('close', () => {
    clearInterval(pingInterval);
  });

  return wsInstance;
}