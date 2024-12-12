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
    <div class="account admin-account ${(account.status || 'unknown').toLowerCase().replace(' ', '-')}">
      <div class="account-header">
        <div class="account-title">
          <h3>${account.name || 'Sin nombre'}</h3>
          <div class="status-badge status-${(account.status || 'unknown').toLowerCase().replace(' ', '-')}">
            ${account.status || 'Unknown'}
          </div>
        </div>
        <div class="account-actions">
          <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/toggle" method="POST" class="inline-form">
            <button type="submit" class="icon-button ${account.status === 'Available' ? 'warning' : 'success'}" title="Cambiar Estado">
              ${account.status === 'Available' ? '🔒' : '🔓'}
            </button>
          </form>
          <form action="/admin/accounts/${encodeURIComponent(account.name || '')}" method="POST" class="inline-form">
            <input type="hidden" name="_method" value="DELETE">
            <button type="submit" class="icon-button danger" title="Eliminar Cuenta">🗑️</button>
          </form>
        </div>
      </div>

      <div class="account-details">
        <div class="url-section">
          <label>URL del Servicio:</label>
          <div class="url-display">
            <input type="url" value="${account.url || ''}" 
                   onchange="updateAccountUrl('${account.name}', this.value)" 
                   class="url-input" 
                   placeholder="https://www.ejemplo.com">
          </div>
        </div>

        <div class="users-section">
          <h4>Configuración de Usuarios</h4>
          <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/max-users" method="POST" class="users-form">
            <div class="form-group">
              <label>Máximo de usuarios simultáneos:</label>
              <div class="number-input">
                <input type="number" name="maxUsers" value="${account.maxUsers || 1}" min="1" required>
                <button type="submit" class="update-button">Actualizar</button>
              </div>
            </div>
          </form>

          <div class="current-users">
            <h5>Usuarios Activos (${usersCount}/${account.maxUsers || 1})</h5>
            ${currentUsers.length > 0 ? `
              <ul class="users-list">
                ${currentUsers.map(user => `
                  <li class="user-item">
                    <span>${user}</span>
                    <button class="icon-button small danger" onclick="kickUser('${account.name}', '${user}')">❌</button>
                  </li>
                `).join('')}
              </ul>
            ` : '<p class="no-users">No hay usuarios conectados</p>'}
          </div>
        </div>

        <div class="cookie-manager">
          <h4>Gestión de Cookies</h4>
          <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/cookies" method="POST" class="cookie-form">
            <div class="form-group">
              <input type="text" name="cookieName" placeholder="Nombre de la cookie" required>
              <input type="text" name="cookieValue" placeholder="Valor de la cookie" required>
              <button type="submit" class="add-button">Añadir Cookie</button>
            </div>
          </form>
          
          ${account.cookies ? `
            <div class="cookies-list">
              ${Object.entries(account.cookies).map(([name, value]) => `
                <div class="cookie-item">
                  <div class="cookie-info">
                    <span class="cookie-name">${name}</span>
                    <span class="cookie-value">${value}</span>
                  </div>
                  <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/cookies/${encodeURIComponent(name)}" 
                        method="POST" 
                        class="inline-form">
                    <input type="hidden" name="_method" value="DELETE">
                    <button type="submit" class="icon-button small danger">❌</button>
                  </form>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="stats-section">
          <h4>Estadísticas de Uso</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Accesos Totales</span>
              <span class="stat-value">${stats.totalAccesses}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pico de Usuarios</span>
              <span class="stat-value">${stats.peakConcurrentUsers}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Último Acceso</span>
              <span class="stat-value">${stats.lastAccess ? new Date(stats.lastAccess).toLocaleString() : 'Nunca'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}