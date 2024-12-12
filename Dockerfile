FROM node:18-alpine

# Install squid client for testing connection
RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]