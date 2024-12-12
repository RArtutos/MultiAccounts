export function renderAdminAccountCard(account) {
  return `
    <div class="account">
      <h3>${account.name}</h3>
      <p>URL: ${account.url}</p>
      <p>Status: ${account.status}</p>
      
      <div class="cookie-form">
        <h4>Manage Cookies</h4>
        <form action="/admin/accounts/${encodeURIComponent(account.name)}/cookies" method="POST">
          <div class="form-group">
            <label>Cookie Name: <input type="text" name="cookieName" required></label>
          </div>
          <div class="form-group">
            <label>Cookie Value: <input type="text" name="cookieValue" required></label>
          </div>
          <div class="form-group">
            <label>Domain: <input type="text" name="domain" value="${new URL(account.url).hostname}"></label>
          </div>
          <div class="form-group">
            <label>Path: <input type="text" name="path" value="/" required></label>
          </div>
          <button type="submit">Add Cookie</button>
        </form>
        
        ${account.cookies ? `
          <h5>Current Cookies:</h5>
          <ul>
            ${Object.entries(account.cookies).map(([name, value]) => `
              <li>
                ${name}: ${value}
                <form action="/admin/accounts/${encodeURIComponent(account.name)}/cookies/${encodeURIComponent(name)}" 
                      method="POST" 
                      style="display: inline">
                  <input type="hidden" name="_method" value="DELETE">
                  <button type="submit">Delete</button>
                </form>
              </li>
            `).join('')}
          </ul>
        ` : ''}
      </div>

      <form action="/admin/accounts/${encodeURIComponent(account.name)}" method="POST" style="display: inline">
        <input type="hidden" name="_method" value="DELETE">
        <button type="submit">Delete Account</button>
      </form>
      <form action="/admin/accounts/${encodeURIComponent(account.name)}/toggle" method="POST" style="display: inline">
        <button type="submit">Toggle Status</button>
      </form>
    </div>
  `;
}