export const adminDashboardScript = `
  let ws;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const reconnectDelay = 5000;

  // WebSocket setup
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

  // Account management functions
  async function updateAccountUrl(accountName, newUrl) {
    await updateAccount(accountName, { url: newUrl });
  }

  async function updateMaxUsers(accountName, maxUsers) {
    await updateAccount(accountName, { maxUsers: parseInt(maxUsers, 10) });
  }

  async function updatePlatform(accountName, platform) {
    await updateAccount(accountName, { platform });
  }

  async function updateIcon(accountName, icon) {
    await updateAccount(accountName, { icon });
  }

  async function updateAccount(accountName, data) {
    try {
      const response = await fetch(\`/admin/accounts/\${encodeURIComponent(accountName)}\`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Error updating account');
      
      const result = await response.json();
      if (result.success) {
        showNotification('Cuenta actualizada correctamente', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al actualizar la cuenta', 'error');
    }
  }

  // Tag management
  function focusTagInput(container) {
    container.querySelector('.tag-input').focus();
  }

  async function handleTagInput(event, accountName) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const input = event.target;
      const tag = input.value.trim();
      
      if (tag && tag.length > 0) {
        await addTag(accountName, tag);
        input.value = '';
      }
    }
  }

  async function addTag(accountName, tag) {
    try {
      const response = await fetch(\`/admin/accounts/\${encodeURIComponent(accountName)}/tags\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tag })
      });
      
      if (!response.ok) throw new Error('Error adding tag');
      
      const result = await response.json();
      if (result.success) {
        showNotification('Etiqueta agregada correctamente', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al agregar la etiqueta', 'error');
    }
  }

  async function removeTag(accountName, tag) {
    try {
      const response = await fetch(\`/admin/accounts/\${encodeURIComponent(accountName)}/tags/\${encodeURIComponent(tag)}\`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error removing tag');
      
      const result = await response.json();
      if (result.success) {
        showNotification('Etiqueta eliminada correctamente', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al eliminar la etiqueta', 'error');
    }
  }

  // Notification system
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

  // Initialize WebSocket when document is ready
  document.addEventListener('DOMContentLoaded', connectWebSocket);
`;