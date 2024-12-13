export function renderAccountControls(account) {
  return `
    <div class="account-actions">
      <form action="/admin/accounts/${encodeURIComponent(account.name || '')}/toggle" method="POST" class="inline-form">
        <button type="submit" 
                class="icon-button ${account.status === 'Available' ? 'warning' : 'success'}" 
                title="${account.status === 'Available' ? 'Bloquear Cuenta' : 'Desbloquear Cuenta'}">
          ${account.status === 'Available' ? '🔒' : '🔓'}
        </button>
      </form>
      <form action="/admin/accounts/${encodeURIComponent(account.name || '')}" method="POST" class="inline-form">
        <input type="hidden" name="_method" value="DELETE">
        <button type="submit" class="icon-button danger" title="Eliminar Cuenta">🗑️</button>
      </form>
    </div>
  `;
}