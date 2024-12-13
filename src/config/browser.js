// Configuración del navegador
export const browserConfig = {
  executablePath: '/usr/bin/chromium-browser',
  args: [
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--no-zygote',
    '--disable-accelerated-2d-canvas',
    '--disable-accelerated-jpeg-decoding',
    '--disable-accelerated-mjpeg-decode',
    '--disable-accelerated-video-decode',
    '--disable-gpu-compositing',
    '--ignore-certificate-errors',
    '--enable-features=NetworkService',
    '--use-gl=swiftshader'
  ],
  headless: true
};