import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const config = {
  port: process.env.PORT || 3000,
  dataPath: join(__dirname, '../../data/accounts.json'),
  admin: {
    username: process.env.ADMIN_USER || 'admin',
    password: process.env.ADMIN_PASSWORD || 'secret'
  },
  domain: {
    base: 'artutos.us.kg',
    protocol: 'https'
  }
};