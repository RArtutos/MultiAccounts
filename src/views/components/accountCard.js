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
    <div class="account ${statusClass}" data-platform="${account.platform || ''}">
      <div class="account-header">
        <div class="platform-icon">
          <img src="${account.icon || '/default-icon.png'}" alt="${account.platform}" 
               onerror="this.src='/default-icon.png'">
        </div>
        <div class="platform-badge">${account.platform || 'Unknown'}</div>
      </div>
      
      <h3>${account.name || 'Sin nombre'}</h3>
      
      <div class="tags">
        ${(account.tags || []).map(tag => `
          <span class="tag">${tag}</span>
        `).join('')}
      </div>

      <div class="status-badge status-${statusClass}">
        ${status}
      </div>
      
      <div class="usage-info">
        <div class="users-counter">
          <div class="counter-value">${usersCount}/${maxUsers}</div>
          <div class="counter-label">Usuarios Conectados</div>
        </div>
        <div class="progress-bar">
          <div class="progress" style="width: ${(usersCount / maxUsers) * 100}%"></div>
        </div>
      </div>

      ${status === 'Available' ? `
        <div class="account-actions">
          <a href="${account.proxyUrl}" target="_blank" class="access-button">
            <span class="button-text">Acceder ahora</span>
          </a>
          ${availableSlots > 0 ? `
            <div class="slots-available">
              ${availableSlots} ${availableSlots === 1 ? 'espacio libre' : 'espacios libres'}
            </div>
          ` : ''}
        </div>
      ` : `
        <div class="account-unavailable">
          Cuenta no disponible
        </div>
      `}
    </div>
  `;
}