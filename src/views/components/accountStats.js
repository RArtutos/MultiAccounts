export function renderAccountStats(account) {
  const stats = account.stats || {
    totalAccesses: 0,
    lastAccess: null,
    peakConcurrentUsers: 0
  };

  return `
    <div class="account-section stats-section">
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
        <div class="stat-item">
          <span class="stat-label">Pico de Usuarios</span>
          <span class="stat-value">${stats.peakConcurrentUsers}</span>
        </div>
      </div>
    </div>
  `;
}