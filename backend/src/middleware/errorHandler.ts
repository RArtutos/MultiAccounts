import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', err);

  res.status(500).json({
    error: {
      message: 'Error interno del servidor',
      ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    },
  });
};