FROM node:18-alpine

# Instalar dependencias necesarias para Playwright y Chrome
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    python3 \
    py3-pip \
    build-base \
    g++ \
    jpeg-dev \
    zlib-dev \
    libx11-dev \
    libxcomposite-dev \
    libxdamage-dev \
    libxi-dev \
    libxtst-dev \
    libc6-compat

# Configurar variables de entorno para Playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copiar archivos de la aplicación
COPY package*.json ./
RUN npm install

# Crear directorio para el caché de Playwright
RUN mkdir -p /root/.cache/ms-playwright && \
    chown -R node:node /root/.cache/ms-playwright

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]