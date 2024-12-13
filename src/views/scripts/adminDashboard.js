export const adminDashboardScript = `
  let ws;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const reconnectDelay = 5000;

  // Función para conectar WebSocket
  function connectWebSocket() {
    ws = new WebSocket(\`ws://\${window.location.host}/updates\`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'accountsUpdate' && Array.isArray(data.accounts)) {
          updateAdminDashboard(data.accounts);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts = 0;
      showNotification('Conexión establecida', 'success');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      showNotification('Error de conexión', 'error');
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        showNotification(\`Reconectando (intento \${reconnectAttempts}/\${maxReconnectAttempts})...\`, 'warning');
        setTimeout(connectWebSocket, reconnectDelay);
      } else {
        showNotification('No se pudo reconectar. Recargando página...', 'error');
        setTimeout(() => window.location.reload(), 3000);
      }
    };
  }

  // Función para actualizar la URL de una cuenta
  async function updateAccountUrl(accountName, newUrl) {
    try {
      const response = await fetch(\`/admin/accounts/\${encodeURIComponent(accountName)}/url\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: newUrl })
      });
      
      if (!response.ok) throw new Error('Error actualizando URL');
      
      const data = await response.json();
      if (data.success) {
        showNotification('URL actualizada correctamente', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al actualizar la URL', 'error');
    }
  }

  // Función para actualizar el máximo de usuarios
  async function updateMaxUsers(accountName, maxUsers) {
    try {
      const response = await fetch(\`/admin/accounts/\${encodeURIComponent(accountName)}/max-users\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ maxUsers: parseInt(maxUsers, 10) })
      });
      
      if (!response.ok) throw new Error('Error actualizando máximo de usuarios');
      
      const data = await response.json();
      if (data.success) {
        showNotification('Máximo de usuarios actualizado correctamente', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al actualizar el máximo de usuarios', 'error');
    }
  }

  // Sistema de notificaciones
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = \`notification \${type}\`;
    notification.textContent = message;
    
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = \`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 25px;
          border-radius: 5px;
          color: white;
          font-weight: 500;
          z-index: 1000;
          animation: slideIn 0.5s ease-out;
        }
        .notification.success { background-color: var(--success); }
        .notification.error { background-color: var(--error); }
        .notification.warning { background-color: #f59e0b; }
        .notification.info { background-color: var(--accent); }
        .notification.fade-out {
          animation: fadeOut 0.5s ease-in forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      \`;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  // Función para actualizar el dashboard
  function updateAdminDashboard(accounts) {
    const accountsGrid = document.querySelector('.accounts-grid');
    if (!accountsGrid) return;
    
    accountsGrid.innerHTML = accounts.map(account => renderAdminAccountCard(account)).join('');
  }

  // Iniciar conexión WebSocket cuando el documento esté listo
  document.addEventListener('DOMContentLoaded', connectWebSocket);
`;