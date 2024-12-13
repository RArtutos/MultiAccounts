export function renderAccountControls(account) {
  return `
    <div class="account-actions">
      <button onclick="toggleAccountStatus('${account.name}')"
              class="icon-button ${account.status === 'Available' ? 'warning' : 'success'}" 
              title="${account.status === 'Available' ? 'Bloquear Cuenta' : 'Desbloquear Cuenta'}">
        ${account.status === 'Available' ? '🔒' : '🔓'}
      </button>
      <button onclick="deleteAccount('${account.name}')" 
              class="icon-button danger" 
              title="Eliminar Cuenta">
        🗑️
      </button>
    </div>
  `;
}