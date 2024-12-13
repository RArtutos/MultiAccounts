export function renderAccountActions(account) {
  if (account.status !== 'Available') {
    return `
      <div class="account-unavailable">
        Cuenta no disponible
      </div>
    `;
  }

  const currentUsers = Array.isArray(account.currentUsers) ? account.currentUsers : [];
  const usersCount = currentUsers.length;
  const maxUsers = account.maxUsers || 1;
  const availableSlots = maxUsers - usersCount;

  return `
    <div class="account-actions">
      <a href="${account.proxyUrl}" target="_blank" class="access-button">
        <span class="button-text">Acceder ahora</span>
      </a>
      ${availableSlots > 0 ? `
        <div class="slots-available">
          ${availableSlots} ${availableSlots === 1 ? 'espacio libre' : 'espacios libres'}
        </div>
      ` : ''}
    </div>
  `;
}