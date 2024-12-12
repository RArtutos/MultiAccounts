export function renderAccountCard(account) {
  // Validación de seguridad para evitar errores si account es undefined
  if (!account) {
    return '<div class="account">Error: Cuenta no válida</div>';
  }

  const statusClass = (account.status || 'unknown').toLowerCase().replace(' ', '-');
  const statusBadgeClass = `status-${statusClass}`;
  const currentUsers = Array.isArray(account.currentUsers) ? account.currentUsers : [];
  const usersCount = currentUsers.length;
  const maxUsers = account.maxUsers || 1;
  const availableSlots = maxUsers - usersCount;
  
  return `
    <div class="account ${statusClass}">
      <h3>${account.name || 'Sin nombre'}</h3>
      <div class="status-badge ${statusBadgeClass}">
        ${account.status || 'Desconocido'}
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
      
      ${account.status === 'Available' ? `
        <p class="url">
          <a href="/stream/${encodeURIComponent(account.name || '')}/" target="_blank" class="access-button">
            Acceder al servicio
          </a>
        </p>
      ` : ''}
    </div>
  `;
}