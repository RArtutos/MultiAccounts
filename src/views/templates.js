export function renderAdminDashboard(accounts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .form-group { margin: 10px 0; }
        .account { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .cookie-form { background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>Admin Dashboard</h1>
      
      <h2>Add New Account</h2>
      <form action="/admin/accounts" method="POST">
        <div class="form-group">
          <label>Name: <input type="text" name="name" required></label>
        </div>
        <div class="form-group">
          <label>URL: <input type="url" name="url" required></label>
        </div>
        <button type="submit">Add Account</button>
      </form>

      <h2>Existing Accounts</h2>
      ${accounts.map(account => `
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
      `).join('')}
    </body>
    </html>
  `;
}