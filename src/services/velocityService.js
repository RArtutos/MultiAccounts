import { velocityConfig } from '../config/velocity.js';
import { CookieManager } from '../utils/cookies/cookieManager.js';
import fs from 'fs/promises';
import path from 'path';

export class VelocityService {
  constructor(account) {
    this.account = account;
    this.cookieManager = new CookieManager(account);
    this.config = {
      ...velocityConfig,
      target: account.url
    };
  }

  async createProxyInstance() {
    const cookies = await this.cookieManager.getAccountCookies();
    const cookieString = await this.cookieManager.getCookieString();

    // Leer el cliente de Velocity
    const velocityPath = path.join(process.cwd(), 'src/velocity/dist');
    const clientHtml = await fs.readFile(path.join(velocityPath, 'index.html'), 'utf8');

    return {
      config: {
        ...this.config,
        cookies,
        headers: {
          ...velocityConfig.netflix.headers,
          'Cookie': cookieString
        },
        clientHtml,
        handleRequest: (req, res) => {
          // Implementar la lógica de manejo de solicitudes de Velocity aquí
          // Esto debería usar la configuración de Velocity para procesar la solicitud
          const velocityHandler = this.createVelocityHandler();
          return velocityHandler(req, res);
        }
      }
    };
  }

  createVelocityHandler() {
    return (req, res) => {
      // Implementar la lógica de manejo de Velocity
      // Esto debería usar la configuración de Velocity para procesar la solicitud
      const { target, headers } = this.config;
      
      // Configurar las opciones de proxy
      const proxyOptions = {
        target,
        headers,
        changeOrigin: true,
        secure: true,
        ws: true
      };

      // Crear y retornar el handler de proxy
      return require('http-proxy').createProxyServer(proxyOptions).web(req, res);
    };
  }

  getProxyUrl(path = '') {
    const baseUrl = this.account.url;
    const encodedUrl = encodeURIComponent(`${baseUrl}${path}`);
    return `${velocityConfig.prefix}${encodedUrl}`;
  }
}