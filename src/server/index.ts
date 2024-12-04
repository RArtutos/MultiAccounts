import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { accountsRouter } from './routes/accounts';
import { subscriptionsRouter } from './routes/subscriptions';
import { devicesRouter } from './routes/devices';
import { logsRouter } from './routes/logs';
import { statsRouter } from './routes/stats';
import { errorHandler } from './middleware/error-handler';
import { authenticate } from './middleware/authenticate';

const app = express();

app.use(cors());
app.use(json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/users', authenticate, usersRouter);
app.use('/api/service-accounts', authenticate, accountsRouter);
app.use('/api/subscriptions', authenticate, subscriptionsRouter);
app.use('/api/devices', authenticate, devicesRouter);
app.use('/api/activity-logs', authenticate, logsRouter);
app.use('/api/stats', authenticate, statsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});