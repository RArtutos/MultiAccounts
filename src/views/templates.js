import { renderAccountCard } from './components/accountCard.js';
import { renderAdminAccountCard } from './components/adminAccountCard.js';

export function renderDashboard(accounts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Streaming Accounts Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-primary: #1a1b1e;
          --bg-secondary: #2c2d31;
          --text-primary: #ffffff;
          --text-secondary: #a1a1aa;
          --accent: #3b82f6;
          --success: #22c55e;
          --error: #ef4444;
          --card-bg: #2c2d31;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          margin: 0;
          padding: 2rem;
          min-height: 100vh;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1 {
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
          background: linear-gradient(to right, var(--accent), #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 1rem;
        }
        
        .account {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: transform 0.2s ease;
        }
        
        .account:hover {
          transform: translateY(-4px);
        }
        
        .account h3 {
          font-size: 1.25rem;
          margin: 0 0 1rem 0;
          color: var(--text-primary);
        }
        
        .account p {
          color: var(--text-secondary);
          margin: 0.5rem 0;
        }
        
        .usage-info {
          margin: 1rem 0;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: var(--bg-primary);
          border-radius: 4px;
          overflow: hidden;
          margin: 0.5rem 0;
        }
        
        .progress {
          height: 100%;
          background: linear-gradient(to right, var(--accent), #8b5cf6);
          transition: width 0.3s ease;
        }
        
        .slots-available {
          color: var(--success);
          font-weight: 500;
        }
        
        .no-slots {
          color: var(--error);
          font-weight: 500;
        }
        
        .access-button {
          display: inline-block;
          background: linear-gradient(to right, var(--accent), #8b5cf6);
          color: white;
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          font-weight: 500;
          transition: transform 0.2s ease;
        }
        
        .access-button:hover {
          transform: translateY(-2px);
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        
        .status-available {
          background-color: rgba(34, 197, 94, 0.1);
          color: var(--success);
        }
        
        .status-in-use {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }
      </style>
      <script>
        // WebSocket para actualizaciones en tiempo real
        document.addEventListener('DOMContentLoaded', () => {
          const ws = new WebSocket(\`ws://\${window.location.host}/updates\`);
          const accountsGrid = document.querySelector('.accounts-grid');
          
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'accountsUpdate') {
              accountsGrid.innerHTML = data.accounts.map(account => {
                return \`${renderAccountCard({ name: 'PLACEHOLDER' }).replace(/`/g, '\\`')}\`.replace('PLACEHOLDER', account.name);
              }).join('');
            }
          };
          
          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
          
          ws.onclose = () => {
            console.log('WebSocket connection closed');
            // Intentar reconectar después de 5 segundos
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          };
        });
      </script>
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

export function renderAdminDashboard(accounts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-primary: #1a1b1e;
          --bg-secondary: #2c2d31;
          --text-primary: #ffffff;
          --text-secondary: #a1a1aa;
          --accent: #3b82f6;
          --success: #22c55e;
          --error: #ef4444;
          --card-bg: #2c2d31;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          margin: 0;
          padding: 2rem;
          min-height: 100vh;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1, h2, h3, h4 {
          background: linear-gradient(to right, var(--accent), #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        h1 {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        h2 {
          font-size: 1.8rem;
          margin: 2rem 0 1rem;
        }
        
        .form-container {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
        
        input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #4b5563;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          margin-top: 0.25rem;
        }
        
        button {
          background-color: var(--accent);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        
        button:hover {
          background-color: #2563eb;
        }
        
        .danger {
          background-color: var(--error);
        }
        
        .danger:hover {
          background-color: #dc2626;
        }
        
        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          padding: 1rem;
        }
        
        .stats-panel {
          background-color: var(--bg-primary);
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin: 1rem 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .stat-item {
          background-color: var(--card-bg);
          padding: 1rem;
          border-radius: 0.5rem;
        }
        
        .stat-label {
          display: block;
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .cookie-form {
          background-color: var(--bg-primary);
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-top: 1rem;
        }
        
        .cookie-list {
          margin-top: 1rem;
        }
        
        .cookie-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background-color: var(--card-bg);
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }
        
        .button-group {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
      </style>
      <script>
        // WebSocket para actualizaciones en tiempo real
        document.addEventListener('DOMContentLoaded', () => {
          const ws = new WebSocket(\`ws://\${window.location.host}/updates\`);
          const accountsGrid = document.querySelector('.accounts-grid');
          
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'accountsUpdate') {
              accountsGrid.innerHTML = data.accounts.map(account => {
                return \`${renderAdminAccountCard({ name: 'PLACEHOLDER' }).replace(/`/g, '\\`')}\`.replace('PLACEHOLDER', account.name);
              }).join('');
            }
          };
          
          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
          
          ws.onclose = () => {
            console.log('WebSocket connection closed');
            // Intentar reconectar después de 5 segundos
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          };
        });
      </script>
    </head>
    <body>
      <div class="container">
        <h1>Admin Dashboard</h1>
        
        <div class="form-container">
          <h2>Add New Account</h2>
          <form action="/admin/accounts" method="POST">
            <div class="form-group">
              <label>Name</label>
              <input type="text" name="name" required placeholder="Netflix Account 1">
            </div>
            <div class="form-group">
              <label>URL</label>
              <input type="url" name="url" required placeholder="https://www.netflix.com">
            </div>
            <div class="form-group">
              <label>Maximum Concurrent Users</label>
              <input type="number" name="maxUsers" required value="1" min="1">
            </div>
            <button type="submit">Add Account</button>
          </form>
        </div>

        <h2>Existing Accounts</h2>
        <div class="accounts-grid">
          ${accounts.map(account => renderAdminAccountCard(account)).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
}