export const websocketScript = `
  document.addEventListener('DOMContentLoaded', () => {
    const ws = new WebSocket(\`ws://\${window.location.host}/updates\`);
    const accountsGrid = document.querySelector('.accounts-grid');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'accountsUpdate' && Array.isArray(data.accounts)) {
          accountsGrid.innerHTML = data.accounts.map(account => renderAccountCard(account)).join('');
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      showNotification('Error de conexión', 'error');
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      showNotification('Conexión perdida. Reconectando...', 'warning');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    };
  });

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
`;