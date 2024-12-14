FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ git

# Create velocity directory structure
RUN mkdir -p src/velocity/dist

# Copy configuration files
COPY package*.json ./

# Install dependencies
RUN npm install

# Clone and build Velocity
RUN git clone https://github.com/cohenerickson/Velocity.git velocity && \
    cd velocity && \
    npm install && \
    npm run build && \
    cp -r dist/* ../src/velocity/dist/ && \
    cd .. && \
    rm -rf velocity

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "src/server.js"]