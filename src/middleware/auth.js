import basicAuth from 'express-basic-auth';
import { config } from '../config/index.js';

export const adminAuth = basicAuth({
  users: { [config.admin.username]: config.admin.password },
  challenge: true
});