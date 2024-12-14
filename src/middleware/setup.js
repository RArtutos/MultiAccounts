import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from '../config/index.js';

export function setupMiddleware(app) {
  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Serve static files
  app.use(express.static('public'));
  app.use('/velocity', express.static('src/velocity'));

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
}