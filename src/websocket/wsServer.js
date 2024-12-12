import expressWs from 'express-ws';
import { accountEvents } from '../services/accountService.js';

export function setupWebSocket(app) {
  // Inicializar WebSocket
  const wsInstance = expressWs(app);
  
  // Manejar conexiones WebSocket
  app.ws('/updates', function(ws, req) {
    const sendUpdate = async () => {
      try {
        const { accounts } = await accountService.getAccounts();
        ws.send(JSON.stringify({ type: 'accountsUpdate', accounts }));
      } catch (error) {
        console.error('Error sending update:', error);
      }
    };

    // Suscribirse a eventos de actualización
    accountEvents.on('accountsUpdated', sendUpdate);
    
    // Enviar estado inicial
    sendUpdate();

    // Limpiar al desconectar
    ws.on('close', () => {
      accountEvents.removeListener('accountsUpdated', sendUpdate);
    });

    // Manejar errores
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wsInstance;
}