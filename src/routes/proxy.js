import express from 'express';
import { createStreamingProxy } from '../middleware/proxy.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();

// Proxy route for streaming services
router.get('/stream/:platform/*', async (req, res, next) => {
  try {
    const { platform } = req.params;
    const { accounts } = await accountService.getAccounts();
    
    // Verify if platform exists in our accounts
    const validPlatform = accounts.some(acc => acc.url.includes(platform));
    
    if (!validPlatform) {
      return res.status(404).send('Platform not supported');
    }

    // Handle the proxy request
    return createStreamingProxy(req, res, next);
  } catch (error) {
    console.error('Streaming error:', error);
    res.status(500).send('Error accessing streaming service');
  }
});

export default router;