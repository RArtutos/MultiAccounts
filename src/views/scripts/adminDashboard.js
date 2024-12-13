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
  async function toggleAccountStatus(accountName) {
    try {
      const response = await fetch(\`/admin/accounts/\${encodeURIComponent(accountName)}/toggle\`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Error toggling account status');
      
      const result = await response.json();
      if (result.success) {
        showNotification('Estado de la cuenta actualizado', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al actualizar el estado de la cuenta', 'error');
    }
  }

  async function deleteAccount(accountName) {
    if (!confirm('¿Está seguro de que desea eliminar esta cuenta?')) {
      return;
    }

    try {
      const response = await fetch(\`/admin/accounts/\${encodeURIComponent(accountName)}\`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error deleting account');
      
      const result = await response.json();
      if (result.success) {
        showNotification('Cuenta eliminada correctamente', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al eliminar la cuenta', 'error');
    }
  }

  // Rest of the existing code...
`;