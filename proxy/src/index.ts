import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { logger } from './utils/logger';
import { verifyToken } from './middleware/auth';

config();

const app = express();
const PORT = process.env.PROXY_PORT || 8080;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Verificación de token para todas las rutas
app.use(verifyToken);

// Configuración de proxy para Netflix
app.use('/netflix', createProxyMiddleware({
  target: process.env.NETFLIX_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/netflix': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`Proxy request to Netflix: ${req.path}`);
  },
}));

// Configuración de proxy para YouTube
app.use('/youtube', createProxyMiddleware({
  target: process.env.YOUTUBE_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/youtube': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`Proxy request to YouTube: ${req.path}`);
  },
}));

app.listen(PORT, () => {
  logger.info(`Proxy server running on port ${PORT}`);
});