# Sistema de Gestión de Cuentas de Streaming

Sistema centralizado para gestionar cuentas de servicios de streaming con proxy reverso integrado.

## Características

- Panel de administración para gestión de cuentas
- Sistema de proxy reverso para redirección de servicios
- Gestión de usuarios y permisos
- Control de acceso y límites por cuenta
- Interfaz moderna y responsiva
- Sistema de logs y monitoreo

## Estructura del Proyecto

```
├── frontend/           # Aplicación React (Vite)
├── backend/           # API Node.js (Express)
├── docs/             # Documentación detallada
└── docker/           # Configuración de Docker
```

## Requisitos Previos

- Node.js 18 o superior
- npm 8 o superior
- Docker y Docker Compose (para producción)

## Configuración del Entorno

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/proxy-streaming-manager.git
cd proxy-streaming-manager
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Iniciar en modo desarrollo:
```bash
npm run dev
```

## Documentación

- [Guía de Usuario](./docs/user-guide.md)
- [Manual de Administración](./docs/admin-guide.md)
- [API Reference](./docs/api-reference.md)
- [Arquitectura](./docs/architecture.md)

## Seguridad

- Autenticación mediante JWT
- Variables de entorno para credenciales
- Rate limiting y protección contra ataques
- Logs de seguridad

## Licencia

MIT