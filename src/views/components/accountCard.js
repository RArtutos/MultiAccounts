export function renderAccountCard(account) {
  const statusClass = account.status.toLowerCase().replace(' ', '-');
  return `
    <div class="account ${statusClass}">
      <h3>${account.name}</h3>
      <p>Status: ${account.status}</p>
      ${account.status === 'Available' ? `
        <p>Stream URL: <a href="/stream/${encodeURIComponent(account.name)}/">${account.url}</a></p>
      ` : ''}
    </div>
  `;
}