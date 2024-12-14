import express from 'express';
import * as accountService from '../services/accountService.js';
import { renderUserDashboard } from '../views/templates/userDashboard.js';
import { config } from '../config/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { accounts } = await accountService.getAccounts();
    const accountsWithUrls = accounts.map(account => ({
      ...account,
      proxyUrl: `${config.domain.protocol}://${account.name}.${config.domain.base}`
    }));
    res.send(renderUserDashboard(accountsWithUrls));
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

export { router as dashboardRouter };