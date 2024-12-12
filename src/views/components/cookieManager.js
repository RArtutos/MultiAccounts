export function renderCookieManager(account) {
  return `
    <div class="cookie-manager">
      <h4>Gestión de Cookies</h4>
      <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/cookies" method="POST" class="cookie-form">
        <div class="form-group">
          <input type="text" name="cookieName" placeholder="Nombre de la cookie" required>
          <input type="text" name="cookieValue" placeholder="Valor de la cookie" required>
          <button type="submit" class="add-button">Añadir Cookie</button>
        </div>
      </form>
      
      ${account.cookies ? `
        <div class="cookies-list">
          ${Object.entries(account.cookies).map(([name, value]) => `
            <div class="cookie-item">
              <div class="cookie-info">
                <span class="cookie-name">${name}</span>
                <span class="cookie-value">${value}</span>
              </div>
              <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/cookies/${encodeURIComponent(name)}" 
                    method="POST" 
                    class="inline-form">
                <input type="hidden" name="_method" value="DELETE">
                <button type="submit" class="icon-button small danger">❌</button>
              </form>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}