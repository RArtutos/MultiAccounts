const defaultIcon = 'https://i.ibb.co/vVTrtdH/Icono-video.png';

export function renderAccountHeader(account) {
  return `
    <div class="account-header">
      <div class="platform-icon">
        <img src="${account.icon || defaultIcon}" 
             alt="${account.platform}" 
             onerror="this.src='${defaultIcon}'">
      </div>
      <div class="platform-badge">${account.platform || 'Unknown'}</div>
    </div>
    
    <h3>${account.name || 'Sin nombre'}</h3>
    
    <div class="tags">
      ${(account.tags || []).map(tag => `
        <span class="tag">${tag}</span>
      `).join('')}
    </div>

    <div class="status-badge status-${account.status?.toLowerCase().replace(' ', '-') || 'unknown'}">
      ${account.status || 'Unknown'}
    </div>
  `;
}