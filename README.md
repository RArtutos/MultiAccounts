# Account Management System

A fully functional, production-ready account management system with proxy support and browser automation.

## Features

- User management with role-based access control
- Service account management (Netflix, YouTube, etc.)
- Subscription management with time-based access
- Device management with limits per account
- Activity logging
- Proxy support for secure access
- Browser automation for account access
- SSL encryption for all connections

## Prerequisites

- Docker and Docker Compose
- Node.js 20 or later
- SSL certificates (for production)

## Installation

1. Clone the repository
2. Create SSL certificates or use Let's Encrypt:
   ```bash
   mkdir ssl
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem
   ```

3. Start the services:
   ```bash
   docker-compose up -d
   docker-compose -f docker-compose.proxy.yml up -d
   ```

4. The application will be available at:
   - Frontend: https://localhost
   - API: https://localhost/api
   - Proxy: localhost:3128
   - Selenium Grid: http://localhost:4444

## Configuration

1. Environment variables (create a `.env` file):
   ```
   NODE_ENV=production
   JWT_SECRET=your-secret-key-change-in-production
   ```

2. Update the Nginx configuration in `nginx.conf` with your domain.

3. Configure the proxy settings in `squid.conf` if needed.

## Usage

1. Access the admin panel at https://localhost
2. Create service accounts
3. Add users and assign subscriptions
4. Monitor activity through the logs

## Security

- All traffic is encrypted with SSL
- JWT authentication for API access
- Proxy support for anonymous access
- Rate limiting and request validation
- Secure password hashing

## License

MIT