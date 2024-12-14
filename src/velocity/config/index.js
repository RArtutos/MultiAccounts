import { VELOCITY_PATHS, DEFAULT_HEADERS, CLIENT_CONFIG } from './constants.js';

export const velocityConfig = {
  prefix: VELOCITY_PATHS.SERVICE,
  codec: 'plain',
  bare: {
    version: 2,
    path: VELOCITY_PATHS.BARE
  },
  staticPath: VELOCITY_PATHS.STATIC,
  client: CLIENT_CONFIG,
  headers: DEFAULT_HEADERS
};