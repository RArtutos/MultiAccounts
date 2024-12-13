import { renderAdminAccountCard } from '../components/adminAccountCard.js';
import { adminDashboardStyles } from '../styles/adminDashboard.js';

export function renderAdminDashboard(accounts) {
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
                <option value="other">Otro</option>
              </select>
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

      <script>
        async function toggleAccountStatus(accountName) {
          try {
            const response = await fetch(\`/admin/accounts/\${encodeURIComponent(accountName)}/toggle\`, {
              method: 'POST'
            });
            if (!response.ok) throw new Error('Error toggling account status');
            window.location.reload();
          } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar el estado de la cuenta');
          }
        }

        async function deleteAccount(accountName) {
          if (!confirm('¿Está seguro de que desea eliminar esta cuenta?')) {
            return;
          }

          try {
            const response = await fetch(\`/admin/accounts/\${encodeURIComponent(accountName)}\`, {
              method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error deleting account');
            window.location.reload();
          } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar la cuenta');
          }
        }

        function updateAccountUrl(accountName, url) {
          // Implementar actualización de URL
        }

        function updatePlatform(accountName, platform) {
          // Implementar actualización de plataforma
        }

        function updateMaxUsers(accountName, maxUsers) {
          // Implementar actualización de usuarios máximos
        }
      </script>
    </body>
    </html>
  `;
}