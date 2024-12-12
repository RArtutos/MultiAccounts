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
    <div class="admin-account">
      <div class="account-content">
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

        <div class="account-section">
          <label>URL del Servicio:</label>
          <input type="url" value="${account.url || ''}" 
                 onchange="updateAccountUrl('${account.name}', this.value)" 
                 class="url-input" 
                 placeholder="https://www.ejemplo.com">
        </div>

        ${renderCookieManager(account)}

        <div class="account-section">
          <h4>Estadísticas de Uso</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Accesos Totales</span>
              <span class="stat-value">${stats.totalAccesses}</span>
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