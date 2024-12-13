export function renderAccountInfo(account) {
  const currentUsers = Array.isArray(account.currentUsers) ? account.currentUsers : [];
  const usersCount = currentUsers.length;
  const maxUsers = account.maxUsers || 1;

  return `
    <div class="usage-info">
      <div class="users-counter">
        <div class="counter-value">${usersCount}/${maxUsers}</div>
        <div class="counter-label">Usuarios Conectados</div>
      </div>
      <div class="progress-bar">
        <div class="progress" style="width: ${(usersCount / maxUsers) * 100}%"></div>
      </div>
    </div>
  `;
}