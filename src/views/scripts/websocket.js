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
      const button = e.target.closest('.filter-button');
      if (button) {
        e.preventDefault();
        currentFilter = button.dataset.platform;
        
        // Actualizar botones activos
        document.querySelectorAll('.filter-button').forEach(btn => {
          btn.classList.toggle('active', btn === button);
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
`;