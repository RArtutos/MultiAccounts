export function renderAdminAccountCard(account) {
  if (!account) {
    return '<div class="account">Error: Cuenta no válida</div>';
  }

  const currentUsers = Array.isArray(account.currentUsers) ? account.currentUsers : [];
  const usersCount = currentUsers.length;
  const stats = account.stats || {
    totalAccesses: 0,
    lastAccess: null,
    peakConcurrentUsers: 0
  };
  
  return `
    <div class="account ${(account.status || 'unknown').toLowerCase().replace(' ', '-')}">
      <h3>${account.name || 'Sin nombre'}</h3>
      <p>URL: ${account.url || 'No definida'}</p>
      <div class="status-badge status-${(account.status || 'unknown').toLowerCase().replace(' ', '-')}">
        ${account.status || 'Unknown'}
      </div>

      <div class="usage-section">
        <h4>Configuración de Usuarios</h4>
        <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/max-users" method="POST" class="max-users-form">
          <div class="form-group">
            <label>Máximo de usuarios simultáneos</label>
            <input type="number" name="maxUsers" value="${account.maxUsers || 1}" min="1" required>
          </div>
          <button type="submit">Actualizar límite</button>
        </form>

        <div class="stats-panel">
          <h4>Estadísticas</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Usuarios actuales</span>
              <span class="stat-value">${usersCount}/${account.maxUsers || 1}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Accesos totales</span>
              <span class="stat-value">${stats.totalAccesses}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pico de usuarios</span>
              <span class="stat-value">${stats.peakConcurrentUsers}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Último acceso</span>
              <span class="stat-value">${stats.lastAccess ? new Date(stats.lastAccess).toLocaleString() : 'Nunca'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cookie-form">
        <h4>Gestionar Cookies</h4>
        <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/cookies" method="POST">
          <div class="form-group">
            <label>Nombre Cookie</label>
            <input type="text" name="cookieName" required placeholder="session_id">
          </div>
          <div class="form-group">
            <label>Valor Cookie</label>
            <input type="text" name="cookieValue" required placeholder="abc123">
          </div>
          <button type="submit">Añadir Cookie</button>
        </form>
        
        ${account.cookies ? `
          <div class="cookie-list">
            <h5>Cookies Actuales:</h5>
            <ul>
              ${Object.entries(account.cookies).map(([name, value]) => `
                <li class="cookie-item">
                  <span>${name}: ${value}</span>
                  <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/cookies/${encodeURIComponent(name)}" 
                        method="POST" 
                        style="display: inline">
                    <input type="hidden" name="_method" value="DELETE">
                    <button type="submit" class="danger">Eliminar</button>
                  </form>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>

      <div class="button-group">
        <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/toggle" method="POST" style="display: inline">
          <button type="submit">Cambiar Estado</button>
        </form>
        <form action="/admin/accounts/${encodeURIComponent(account.name || '')}" method="POST" style="display: inline">
          <input type="hidden" name="_method" value="DELETE">
          <button type="submit" class="danger">Eliminar Cuenta</button>
        </form>
      </div>
    </div>
  `;
}