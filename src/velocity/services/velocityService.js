import { velocityConfig } from '../config/index.js';
import { ProxyService } from './proxyService.js';
import { getVelocityDistPath } from '../utils/pathUtils.js';
import fs from 'fs/promises';
import path from 'path';

export class VelocityService {
  constructor(account) {
    this.account = account;
    this.proxyService = new ProxyService(account);
  }

  async initialize() {
    try {
      const velocityPath = getVelocityDistPath();
      const clientHtml = await fs.readFile(path.join(velocityPath, 'index.html'), 'utf8');
      
      return {
        config: velocityConfig,
        clientHtml,
        proxy: this.proxyService.createProxy()
      };
    } catch (error) {
      console.error('Error initializing Velocity:', error);
      throw error;
    }
  }

  getProxyUrl(path = '') {
    const baseUrl = this.account.url;
    const encodedUrl = encodeURIComponent(`${baseUrl}${path}`);
    return `${velocityConfig.prefix}${encodedUrl}`;
  }
}