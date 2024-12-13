export const websocketScript = `
  document.addEventListener('DOMContentLoaded', () => {
    const ws = new WebSocket(\`ws://\${window.location.host}/updates\`);
    const accountsGrid = document.querySelector('.accounts-grid');
    let currentFilter = 'all';
    
    function filterAccounts() {
      const accounts = Array.from(accountsGrid.children);
      accounts.forEach(account => {
        const platform = account.dataset.platform;
        account.style.display = 
          currentFilter === 'all' || platform === currentFilter ? '' : 'none';
      });
    }

    // Configurar filtros de plataforma
    document.querySelector('.filters').addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-button')) {
        currentFilter = e.target.dataset.platform;
        
        // Actualizar botones activos
        document.querySelectorAll('.filter-button').forEach(btn => {
          btn.classList.toggle('active', btn === e.target);
        });
        
        filterAccounts();
      }
    });

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'accountsUpdate' && Array.isArray(data.accounts)) {
          accountsGrid.innerHTML = data.accounts.map(account => renderAccountCard(account)).join('');
          filterAccounts();
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    };
  });

  function renderAccountCard(account) {
    if (!account) return '';
    
    const status = account.status || 'Unknown';
    const statusClass = status.toLowerCase().replace(' ', '-');
    const currentUsers = Array.isArray(account.currentUsers) ? account.currentUsers : [];
    const usersCount = currentUsers.length;
    const maxUsers = account.maxUsers || 1;
    const availableSlots = maxUsers - usersCount;
    
    return \`
      <div class="account \${statusClass}" data-platform="\${account.platform || ''}">
        <div class="account-icon">\${account.icon || '🎬'}</div>
        <div class="platform-badge">\${account.platform || 'Unknown'}</div>
        <h3>\${account.name || 'Sin nombre'}</h3>
        
        <div class="tags">
          \${(account.tags || []).map(tag => \`
            <span class="tag">\${tag}</span>
          \`).join('')}
        </div>

        <div class="status-badge status-\${statusClass}">
          \${status}
        </div>
        
        <div class="usage-info">
          <p>Usuarios conectados: <span class="current-users">\${usersCount}</span>/\${maxUsers}</p>
          <div class="progress-bar">
            <div class="progress" style="width: \${(usersCount / maxUsers) * 100}%"></div>
          </div>
          \${availableSlots > 0 ? \`
            <p class="slots-available">¡\${availableSlots} \${availableSlots === 1 ? 'espacio disponible' : 'espacios disponibles'}!</p>
          \` : '<p class="no-slots">No hay espacios disponibles</p>'}
        </div>
        
        \${status === 'Available' ? \`
          <p class="url">
            <a href="/stream/\${encodeURIComponent(account.name || '')}" target="_blank" class="access-button">
              Acceder al servicio
            </a>
          </p>
        \` : ''}
      </div>
    \`;
  }
`;