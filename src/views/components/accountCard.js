export function renderAccountCard(account) {
  const status = account.status || 'Unknown';
  const statusClass = status.toLowerCase().replace(' ', '-');
  
  return `
    <div class="account ${statusClass}">
      <div class="account-header">
        <div class="platform-icon">
          <img src="${account.icon || '/default-icon.png'}" alt="${account.platform}">
        </div>
        <div class="platform-badge">${account.platform || 'Unknown'}</div>
      </div>
      
      <h3>${account.name || 'Sin nombre'}</h3>
      
      <div class="status-badge status-${statusClass}">
        ${status}
      </div>

      ${status === 'Available' ? `
        <div class="account-actions">
          <button onclick="startBrowserSession('${account.name}')" class="access-button">
            Acceder por VNC
          </button>
        </div>
      ` : `
        <div class="account-unavailable">
          Cuenta no disponible
        </div>
      `}
    </div>
  `;
}