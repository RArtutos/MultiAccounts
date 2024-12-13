import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const config = {
  port: 3000,
  dataPath: join(__dirname, '../../data/accounts.json'),
  admin: {
    username: 'admin',
    password: 'secret'
  },
  domain: {
    base: 'artutos.us.kg',
    protocol: 'https'
  }
};