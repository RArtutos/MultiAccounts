import express from 'express';
import { browserManager } from '../services/browser/browserManager.js';
import { displayManager } from '../services/display/displayManager.js';

const router = express.Router();

router.get('/stream/:accountId', async (req, res) => {
  const { accountId } = req.params;
  
  try {
    // Inicializar display y browser
    const { vncPort } = await displayManager.getDisplay(accountId);
    await browserManager.getBrowser(accountId);

    // Renderizar página con cliente noVNC
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Streaming Session</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
          }
          #vnc {
            width: 100%;
            height: 100%;
          }
        </style>
        <script src="/novnc/core/novnc.js"></script>
      </head>
      <body>
        <div id="vnc"></div>
        <script>
          const rfb = new NoVNC.RFB(document.getElementById('vnc'), 
            'ws://' + window.location.hostname + ':${vncPort}');
          
          rfb.scaleViewport = true;
          rfb.qualityLevel = 8;
          rfb.compressionLevel = 6;
          
          rfb.addEventListener('disconnect', () => {
            console.log('Disconnected from VNC');
          });
          
          rfb.addEventListener('connect', () => {
            console.log('Connected to VNC');
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error en streaming:', error);
    res.status(500).send('Error iniciando sesión de streaming');
  }
});

export { router as streamingRouter };