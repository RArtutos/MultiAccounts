FROM ubuntu:22.04

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    chromium-browser \
    xvfb \
    x11vnc \
    novnc \
    supervisor \
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
RUN npm install

COPY . .

# Configurar supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Crear directorio para el socket X11
RUN mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix

# Puerto para noVNC y la aplicación
EXPOSE 6080 3000

CMD ["/usr/bin/supervisord"]