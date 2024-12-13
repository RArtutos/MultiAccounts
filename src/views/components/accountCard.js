export function renderAccountCard(account) {
  const status = account.status || 'Unknown';
  const statusClass = status.toLowerCase().replace(' ', '-');

  return `
    <div class="account">
      <div class="platform-icon">
        <img src="${account.icon || '/default-icon.png'}" 
             alt="${account.platform || 'Platform'}"
             onerror="this.src='/default-icon.png'">
      </div>
      
      <h3>${account.name || 'Sin nombre'}</h3>
      
      <div class="status-badge status-${statusClass}">
        ${status}
      </div>

      ${status === 'Available' ? `
        <a href="${account.proxyUrl}" target="_blank" class="access-button">
          Acceder ahora
        </a>
      ` : `
        <div class="account-unavailable">
          Cuenta no disponible
        </div>
      `}
    </div>
  `;
}