FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ git

# Copy configuration files
COPY package*.json ./

# Install dependencies
RUN npm install

# Clone and build Velocity
RUN git clone https://github.com/cohenerickson/Velocity.git src/velocity && \
    cd src/velocity && \
    npm install && \
    npm run build

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "src/server.js"]