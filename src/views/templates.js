import { renderAccountCard } from './components/accountCard.js';
import { renderAdminAccountCard } from './components/adminAccountCard.js';
import { dashboardStyles } from './styles/dashboard.js';
import { adminDashboardStyles } from './styles/adminDashboard.js';
import { websocketScript } from './scripts/websocket.js';
import { adminDashboardScript } from './scripts/adminDashboard.js';

export function renderDashboard(accounts) {
  const platforms = new Set(accounts.map(account => account.platform).filter(Boolean));

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
        
        <div class="filters">
          <button class="filter-button active" data-platform="all">
            <span class="button-icon">🌟</span>
            Todos
          </button>
          ${Array.from(platforms).map(platform => `
            <button class="filter-button" data-platform="${platform}">
              <span class="button-icon">${platform === 'netflix' ? '🎬' : 
                                        platform === 'hbo' ? '📺' : 
                                        platform === 'disney' ? '✨' : 
                                        platform === 'prime' ? '📦' : 
                                        platform === 'spotify' ? '🎵' : '🎮'}</span>
              ${platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          `).join('')}
        </div>

        <div class="accounts-grid">
          ${accounts.map(account => renderAccountCard(account)).join('')}
        </div>
      </div>
      <script>${websocketScript}</script>
    </body>
    </html>
  `;
}