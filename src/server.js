import express from 'express';
import { setupMiddleware } from './middleware/setup.js';
import { setupRoutes } from './routes/index.js';
import { setupWebSocket } from './websocket/wsServer.js';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

async function startServer() {
  const app = express();

  // Setup middleware
  setupMiddleware(app);

  // Setup WebSocket
  setupWebSocket(app);

  // Setup routes
  setupRoutes(app);

  // Error handling
  app.use(errorHandler);
  app.use(notFoundHandler);

  // Start server
  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
    console.log(`Dashboard: http://localhost:${config.port}/dashboard`);
    console.log(`Admin panel: http://localhost:${config.port}/admin`);
  });
}

startServer().catch(console.error);