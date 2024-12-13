import { renderAdminAccountCard } from '../components/adminAccountCard.js';
import { adminDashboardStyles } from '../styles/adminDashboard.js';
import { adminDashboardScript } from '../scripts/adminDashboard.js';

export function renderAdminDashboard(accounts) {
  const platforms = new Set(accounts.map(account => account.platform).filter(Boolean));

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${adminDashboardStyles}</style>
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
              <label>Plataforma</label>
              <select name="platform" required>
                <option value="netflix">Netflix</option>
                <option value="hbo">HBO</option>
                <option value="disney">Disney+</option>
                <option value="prime">Prime Video</option>
                <option value="spotify">Spotify</option>
                <option value="youtube">YouTube</option>
                ${Array.from(platforms)
                  .filter(p => !['netflix', 'hbo', 'disney', 'prime', 'spotify', 'youtube'].includes(p))
                  .map(p => `<option value="${p}">${p}</option>`)
                  .join('')}
              </select>
            </div>
            <div class="form-group">
              <label>URL del Icono</label>
              <input type="url" name="icon" placeholder="https://example.com/icon.png">
              <small class="help-text">URL de la imagen del icono (opcional)</small>
            </div>
            <div class="form-group">
              <label>Etiquetas (separadas por coma)</label>
              <input type="text" name="tags" placeholder="streaming, movies, series">
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
      <script>${adminDashboardScript}</script>
    </body>
    </html>
  `;
}