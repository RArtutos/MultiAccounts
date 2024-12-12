export function renderAdminAccountCard(account) {
  const usersCount = account.currentUsers.length;
  
  return `
    <div class="account ${account.status.toLowerCase().replace(' ', '-')}">
      <h3>${account.name}</h3>
      <p>URL: ${account.url}</p>
      <div class="status-badge status-${account.status.toLowerCase().replace(' ', '-')}">
        ${account.status}
      </div>

      <div class="usage-section">
        <h4>Configuración de Usuarios</h4>
        <form action="/admin/accounts/${encodeURIComponent(account.name)}/max-users" method="POST" class="max-users-form">
          <div class="form-group">
            <label>Máximo de usuarios simultáneos</label>
            <input type="number" name="maxUsers" value="${account.maxUsers}" min="1" required>
          </div>
          <button type="submit">Actualizar límite</button>
        </form>

        <div class="stats-panel">
          <h4>Estadísticas</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Usuarios actuales</span>
              <span class="stat-value">${usersCount}/${account.maxUsers}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Accesos totales</span>
              <span class="stat-value">${account.stats.totalAccesses}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pico de usuarios</span>
              <span class="stat-value">${account.stats.peakConcurrentUsers}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Último acceso</span>
              <span class="stat-value">${account.stats.lastAccess ? new Date(account.stats.lastAccess).toLocaleString() : 'Nunca'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cookie-form">
        <h4>Gestionar Cookies</h4>
        <form action="/admin/accounts/${encodeURIComponent(account.name)}/cookies" method="POST">
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
                  <form action="/admin/accounts/${encodeURIComponent(account.name)}/cookies/${encodeURIComponent(name)}" 
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
        <form action="/admin/accounts/${encodeURIComponent(account.name)}/toggle" method="POST" style="display: inline">
          <button type="submit">Cambiar Estado</button>
        </form>
        <form action="/admin/accounts/${encodeURIComponent(account.name)}" method="POST" style="display: inline">
          <input type="hidden" name="_method" value="DELETE">
          <button type="submit" class="danger">Eliminar Cuenta</button>
        </form>
      </div>
    </div>
  `;
}