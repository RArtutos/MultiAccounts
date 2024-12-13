export function renderCookieManager(account) {
  return `
    <div class="cookie-manager">
      <h4>Gestión de Cookies</h4>
      <form action="/admin/accounts/${encodeURIComponent(account.name)}/cookies" method="POST" class="cookie-form">
        <div class="form-group">
          <input type="text" name="cookieName" placeholder="Nombre" required>
          <input type="text" name="cookieValue" placeholder="Valor" required>
          <button type="submit" class="add-button">Añadir</button>
        </div>
      </form>
      
      ${account.cookies ? `
        <div class="cookies-list">
          ${Object.entries(account.cookies).map(([name, value]) => `
            <div class="cookie-item">
              <div class="cookie-info">
                <div class="cookie-name" title="${name}">${name}</div>
                <div class="cookie-value-container">
                  <div class="cookie-value" title="Click para ver valor completo">${value}</div>
                  <div class="cookie-value-tooltip">${value}</div>
                </div>
              </div>
              <div class="cookie-actions">
                <form action="/admin/accounts/${encodeURIComponent(account.name)}/cookies/${encodeURIComponent(name)}" 
                      method="POST" 
                      class="inline-form">
                  <button type="submit" class="icon-button small danger" title="Eliminar cookie">❌</button>
                </form>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}