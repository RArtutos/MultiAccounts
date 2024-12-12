export function renderAccountCard(account) {
  const statusClass = account.status.toLowerCase().replace(' ', '-');
  const statusBadgeClass = `status-${statusClass}`;
  const usersCount = account.currentUsers.length;
  const availableSlots = account.maxUsers - usersCount;
  
  return `
    <div class="account ${statusClass}">
      <h3>${account.name}</h3>
      <div class="status-badge ${statusBadgeClass}">
        ${account.status}
      </div>
      
      <div class="usage-info">
        <p>Usuarios conectados: <span class="current-users">${usersCount}</span>/${account.maxUsers}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${(usersCount / account.maxUsers) * 100}%"></div>
        </div>
        ${availableSlots > 0 ? `
          <p class="slots-available">¡${availableSlots} ${availableSlots === 1 ? 'espacio disponible' : 'espacios disponibles'}!</p>
        ` : '<p class="no-slots">No hay espacios disponibles</p>'}
      </div>
      
      ${account.status === 'Available' ? `
        <p class="url">
          <a href="/stream/${encodeURIComponent(account.name)}/" target="_blank" class="access-button">
            Acceder al servicio
          </a>
        </p>
      ` : ''}
    </div>
  `;
}