FROM node:18-bullseye-slim

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    chromium \
    xvfb \
    x11vnc \
    novnc \
    websockify \
    fluxbox \
    xterm \
    net-tools \
    procps \
    python3 \
    python3-pip \
    build-essential \
    pkg-config \
    libx11-dev \
    libxtst-dev \
    libpng-dev \
    libjpeg-dev \
    libgif-dev \
    fonts-noto-color-emoji \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Configurar variables de entorno
ENV DISPLAY=:99
ENV RESOLUTION=1920x1080x24
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Crear directorios necesarios
WORKDIR /app
RUN mkdir -p /app/data /app/logs

# Copiar archivos de la aplicación
COPY package*.json ./
RUN npm install

# Copiar el resto de archivos
COPY . .

# Script de inicio
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Exponer puertos
EXPOSE 3000 6080-6089 5900-5909

CMD ["/start.sh"]