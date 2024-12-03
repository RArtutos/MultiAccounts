import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/auth.routes.js';
import { accountRoutes } from './routes/account.routes.js';
import { sessionRoutes } from './routes/session.routes.js';
import { serviceRoutes } from './routes/service.routes.js';
import { setupDatabase } from './database/setup.js';
import { logger } from './utils/logger.js';

config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/services', serviceRoutes);

// Error handling
app.use(errorHandler);

// Database setup and server start
setupDatabase().then(() => {
  app.listen(PORT, () => {
    logger.info(`Backend server running on port ${PORT}`);
  });
}).catch((error: Error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});