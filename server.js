import express from 'express';
import { config } from './src/config/index.js';
import { router as routes } from './src/routes/index.js';
import { setupWebSocket } from './src/websocket/wsServer.js';
import { setupCleanup } from './src/utils/cleanup.js';

const app = express();

// Configurar middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurar WebSocket
setupWebSocket(app);

// Montar rutas
app.use('/', routes);

// Configurar limpieza
setupCleanup();

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
  console.log(`Dashboard: http://localhost:${config.port}/dashboard`);
  console.log(`Admin panel: http://localhost:${config.port}/admin`);
});