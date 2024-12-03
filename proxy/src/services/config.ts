import { sql } from './db.js';
import { logger } from '../utils/logger.js';

interface ServiceConfig {
  baseUrl: string;
  name: string;
}

interface ServiceRow {
  name: string;
  baseUrl: string;
}

export async function getServiceConfig(serviceName: string): Promise<ServiceConfig | null> {
  try {
    const [service] = await sql<ServiceRow[]>`
      SELECT name, base_url as "baseUrl"
      FROM streaming_services
      WHERE name = ${serviceName}
    `;
    
    if (!service) return null;

    return {
      name: service.name,
      baseUrl: service.baseUrl
    };
  } catch (error) {
    logger.error('Error fetching service config:', error);
    return null;
  }
}