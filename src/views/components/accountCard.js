export function renderAccountCard(account) {
  if (!account) {
    return '<div class="account">Error: Cuenta no válida</div>';
  }

  const status = account.status || 'Unknown';
  const statusClass = status.toLowerCase().replace(' ', '-');
  const currentUsers = Array.isArray(account.currentUsers) ? account.currentUsers : [];
  const usersCount = currentUsers.length;
  const maxUsers = account.maxUsers || 1;
  const availableSlots = maxUsers - usersCount;
  
  return `
    <div class="account ${statusClass}">
      <h3>${account.name || 'Sin nombre'}</h3>
      <div class="status-badge status-${statusClass}">
        ${status}
      </div>
      
      <div class="usage-info">
        <p>Usuarios conectados: <span class="current-users">${usersCount}</span>/${maxUsers}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${(usersCount / maxUsers) * 100}%"></div>
        </div>
        ${availableSlots > 0 ? `
          <p class="slots-available">¡${availableSlots} ${availableSlots === 1 ? 'espacio disponible' : 'espacios disponibles'}!</p>
        ` : '<p class="no-slots">No hay espacios disponibles</p>'}
      </div>
      
      ${status === 'Available' ? `
        <p class="url">
          <a href="/stream/${encodeURIComponent(account.name || '')}" target="_blank" class="access-button">
            Acceder al servicio
          </a>
        </p>
      ` : ''}
    </div>
  `;
}