import { renderCookieManager } from './cookieManager.js';
import { renderAccountStats } from './accountStats.js';
import { renderAccountControls } from './accountControls.js';

export function renderAdminAccountCard(account) {
  if (!account) {
    return '<div class="account">Error: Cuenta no válida</div>';
  }

  const platforms = ['netflix', 'hbo', 'disney', 'prime', 'spotify', 'youtube', 'other'];
  const icons = ['🎬', '📺', '🎵', '🎮', '📱', '💻', '🎯', '🎨', '📚'];

  return `
    <div class="admin-account">
      <div class="account-content">
        <div class="account-header">
          <div class="account-title">
            <div class="account-icon">${account.icon || '🎬'}</div>
            <div>
              <h3>${account.name || 'Sin nombre'}</h3>
              <div class="status-badge status-${(account.status || 'unknown').toLowerCase().replace(' ', '-')}">
                ${account.status || 'Unknown'}
              </div>
            </div>
          </div>
          ${renderAccountControls(account)}
        </div>

        <div class="account-settings">
          <div class="settings-group">
            <label>URL del Servicio:</label>
            <div class="input-group">
              <input type="url" 
                     value="${account.url || ''}" 
                     onchange="updateAccountUrl('${account.name}', this.value)" 
                     class="url-input" 
                     placeholder="https://www.ejemplo.com">
            </div>
          </div>

          <div class="settings-group">
            <label>Plataforma:</label>
            <select class="platform-select" onchange="updatePlatform('${account.name}', this.value)">
              ${platforms.map(platform => `
                <option value="${platform}" ${account.platform === platform ? 'selected' : ''}>
                  ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="settings-group">
            <label>Icono:</label>
            <div class="icon-select">
              ${icons.map(icon => `
                <div class="icon-option ${account.icon === icon ? 'selected' : ''}"
                     onclick="updateIcon('${account.name}', '${icon}')">
                  ${icon}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="settings-group">
            <label>Etiquetas:</label>
            <div class="tags-input" onclick="focusTagInput(this)">
              ${(account.tags || []).map(tag => `
                <span class="tag">
                  ${tag}
                  <button onclick="removeTag('${account.name}', '${tag}')">&times;</button>
                </span>
              `).join('')}
              <input type="text" 
                     class="tag-input" 
                     placeholder="Agregar etiqueta..."
                     onkeydown="handleTagInput(event, '${account.name}')">
            </div>
          </div>

          <div class="settings-group">
            <label>Máximo de Usuarios:</label>
            <div class="input-group">
              <input type="number" 
                     value="${account.maxUsers || 1}" 
                     min="1" 
                     onchange="updateMaxUsers('${account.name}', this.value)" 
                     class="max-users-input">
            </div>
          </div>
        </div>

        ${renderCookieManager(account)}
        ${renderAccountStats(account)}
      </div>
    </div>
  `;
}