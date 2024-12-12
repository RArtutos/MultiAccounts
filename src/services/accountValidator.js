import { getServiceDomain } from '../utils/urlUtils.js';

export class AccountValidator {
  constructor(accountService) {
    this.accountService = accountService;
  }

  async validateAccount(req, res, next) {
    try {
      const { accountName } = req.params;
      const { accounts } = await this.accountService.getAccounts();
      const account = accounts.find(acc => acc.name === decodeURIComponent(accountName));
      
      if (!account) {
        return res.status(404).send('Cuenta no encontrada');
      }
      
      if (account.status !== 'Available') {
        return res.status(403).send('La cuenta está actualmente en uso');
      }

      const targetDomain = getServiceDomain(account.url);
      if (!targetDomain) {
        return res.status(400).send('URL inválida');
      }

      req.streamingAccount = account;
      req.targetDomain = targetDomain;
      next();
    } catch (error) {
      console.error('Error validando cuenta:', error);
      res.status(500).send('Error interno del servidor');
    }
  }
}