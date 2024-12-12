import { renderAccountCard } from './components/accountCard.js';
import { renderAdminAccountCard } from './components/adminAccountCard.js';

export function renderDashboard(accounts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Streaming Accounts Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .account { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .available { background-color: #e6ffe6; }
        .in-use { background-color: #ffe6e6; }
      </style>
    </head>
    <body>
      <h1>Streaming Accounts Dashboard</h1>
      
      <div class="accounts">
        ${accounts.map(account => renderAccountCard(account)).join('')}
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
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .form-group { margin: 10px 0; }
        .account { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .cookie-form { background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>Admin Dashboard</h1>
      
      <h2>Add New Account</h2>
      <form action="/admin/accounts" method="POST">
        <div class="form-group">
          <label>Name: <input type="text" name="name" required></label>
        </div>
        <div class="form-group">
          <label>URL: <input type="url" name="url" required></label>
        </div>
        <button type="submit">Add Account</button>
      </form>

      <h2>Existing Accounts</h2>
      ${accounts.map(account => renderAdminAccountCard(account)).join('')}
    </body>
    </html>
  `;
}