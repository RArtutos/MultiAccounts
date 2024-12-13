import { renderAccountHeader } from './account/accountHeader.js';
import { renderAccountInfo } from './account/accountInfo.js';
import { renderAccountActions } from './account/accountActions.js';

export function renderAccountCard(account) {
  if (!account) {
    return '<div class="account">Error: Cuenta no válida</div>';
  }

  const status = account.status || 'Unknown';
  const statusClass = status.toLowerCase().replace(' ', '-');
  
  return `
    <div class="account ${statusClass}" data-platform="${account.platform || ''}">
      ${renderAccountHeader(account)}
      ${renderAccountInfo(account)}
      ${renderAccountActions(account)}
    </div>
  `;
}