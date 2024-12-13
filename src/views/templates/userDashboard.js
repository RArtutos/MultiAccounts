import { renderAccountCard } from '../components/accountCard.js';
import { dashboardStyles } from '../styles/dashboard.js';

export function renderUserDashboard(accounts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Streaming Accounts Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${dashboardStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>Streaming Accounts Dashboard</h1>
        <div class="accounts-grid">
          ${accounts.map(account => renderAccountCard(account)).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
}