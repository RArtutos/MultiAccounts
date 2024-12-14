FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copiar archivos de configuración
COPY package*.json ./
COPY src ./src
COPY data ./data

# Instalar dependencias
RUN npm install

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "src/server.js"]