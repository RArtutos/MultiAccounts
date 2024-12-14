import express from 'express';
import { browserService } from '../services/browserService.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();

router.get('/:accountId/start', async (req, res) => {
  try {
    const { accountId } = req.params;
    const { accounts } = await accountService.getAccounts();
    const account = accounts.find(acc => acc.name === accountId);

    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    if (account.status !== 'Available') {
      return res.status(400).json({ error: 'Cuenta no disponible' });
    }

    await browserService.createBrowserSession(accountId, account.url);
    const vncUrl = browserService.getVncUrl(accountId);

    res.json({ success: true, vncUrl });
  } catch (error) {
    console.error('Error starting browser session:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/:accountId/stop', async (req, res) => {
  try {
    const { accountId } = req.params;
    await browserService.closeBrowserSession(accountId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error stopping browser session:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export { router as browserRouter };