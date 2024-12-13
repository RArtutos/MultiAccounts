import { renderAccountCard } from './components/accountCard.js';
import { renderAdminAccountCard } from './components/adminAccountCard.js';
import { dashboardStyles } from './styles/dashboard.js';
import { adminDashboardStyles } from './styles/adminDashboard.js';
import { websocketScript } from './scripts/websocket.js';
import { adminDashboardScript } from './scripts/adminDashboard.js';

export function renderDashboard(accounts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Streaming Accounts Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>${dashboardStyles}</style>
      <script>${websocketScript}</script>
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
      <style>${adminDashboardStyles}</style>
      <script>${adminDashboardScript}</script>
    </head>
    <body>
      <div class="container">
        <h1>Panel de Administración</h1>
        
        <div class="form-container">
          <h2>Agregar Nueva Cuenta</h2>
          <form action="/admin/accounts" method="POST" class="new-account-form">
            <div class="form-group">
              <label>Nombre de la Cuenta</label>
              <input type="text" name="name" required placeholder="Netflix Account 1">
            </div>
            <div class="form-group">
              <label>URL del Servicio</label>
              <input type="url" name="url" required placeholder="https://www.netflix.com">
            </div>
            <div class="form-group">
              <label>Máximo de Usuarios Simultáneos</label>
              <input type="number" name="maxUsers" required value="1" min="1">
            </div>
            <button type="submit" class="add-button">Agregar Cuenta</button>
          </form>
        </div>

        <h2>Cuentas Existentes</h2>
        <div class="accounts-grid">
          ${accounts.map(account => renderAdminAccountCard(account)).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
}