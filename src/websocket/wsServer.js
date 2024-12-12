import expressWs from 'express-ws';
import * as accountService from '../services/accountService.js';
import { EventEmitter } from 'events';

// Crear un emisor de eventos para las actualizaciones de WebSocket
const wsEvents = new EventEmitter();

export function setupWebSocket(app) {
  const wsInstance = expressWs(app);
  
  app.ws('/updates', function(ws, req) {
    const sendUpdate = async () => {
      try {
        const { accounts } = await accountService.getAccounts();
        ws.send(JSON.stringify({ 
          type: 'accountsUpdate', 
          accounts 
        }));
      } catch (error) {
        console.error('Error sending update:', error);
      }
    };

    // Suscribirse a eventos de actualización
    accountEvents.on('accountsUpdated', sendUpdate);
    
    // Enviar estado inicial
    sendUpdate();

    // Mantener viva la conexión
    const pingInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    }, 30000);

    // Limpiar al desconectar
    ws.on('close', () => {
      clearInterval(pingInterval);
      accountEvents.removeListener('accountsUpdated', sendUpdate);
    });

    // Manejar errores
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(pingInterval);
    });
  });

  return wsInstance;
}