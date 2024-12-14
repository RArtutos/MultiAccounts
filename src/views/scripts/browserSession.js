export const browserSessionScript = `
  async function startBrowserSession(accountId) {
    try {
      const response = await fetch(\`/browser/\${accountId}/start\`);
      const data = await response.json();
      
      if (data.success) {
        window.open(data.vncUrl, '_blank', 'width=1280,height=720');
      } else {
        showNotification(data.error || 'Error al iniciar sesión', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al iniciar sesión', 'error');
    }
  }

  async function stopBrowserSession(accountId) {
    try {
      const response = await fetch(\`/browser/\${accountId}/stop\`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        showNotification('Sesión terminada', 'success');
      } else {
        showNotification(data.error || 'Error al terminar sesión', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al terminar sesión', 'error');
    }
  }
`;