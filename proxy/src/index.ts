import express from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { logger } from './utils/logger.js';
import { verifyToken } from './middleware/auth.js';
import { getServiceConfig } from './services/config.js';

config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Verificación de token para todas las rutas
app.use(verifyToken);

// Middleware dinámico para servicios
app.use('/:service', async (req, res, next) => {
  try {
    const service = req.params.service;
    const config = await getServiceConfig(service);
    
    if (!config) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    const proxyOptions: Options = {
      target: config.baseUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/${service}`]: '',
      },
      onProxyReq: (proxyReq, req: express.Request) => {
        logger.info(`Proxy request to ${service}: ${req.url}`);
      },
    };

    return createProxyMiddleware(proxyOptions)(req, res, next);
  } catch (error) {
    logger.error('Proxy error:', error);
    res.status(500).json({ error: 'Error en el proxy' });
  }
});

app.listen(PORT, () => {
  logger.info(`Proxy server running on port ${PORT}`);
});