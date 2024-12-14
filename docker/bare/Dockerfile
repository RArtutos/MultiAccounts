FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar Bare Server
RUN npm install @tomphttp/bare-server-node

# Copiar código fuente
COPY src/bare ./src/bare

# Exponer puerto
EXPOSE 8080

# Comando de inicio
CMD ["node", "src/bare/server.js"]