# Sistema de Gestión de Cuentas de Streaming

Sistema centralizado para gestionar cuentas de servicios de streaming con proxy reverso integrado.

## Características

- Panel de administración para gestión de servicios y cuentas
- Sistema de proxy reverso dinámico para redirección de servicios
- Gestión de usuarios y permisos
- Control de acceso y límites por cuenta
- Interfaz moderna y responsiva
- Sistema de logs y monitoreo
- Configuración dinámica de servicios de streaming

## Estructura del Proyecto

```
├── frontend/          # Aplicación React (Vite)
├── backend/           # API Node.js (Express)
├── proxy/            # Servidor proxy reverso
├── docs/             # Documentación detallada
└── docker/           # Configuración de Docker
```

## Requisitos Previos

- Docker
- Docker Compose
- Node.js 18 o superior (para desarrollo)

## Configuración del Entorno

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/proxy-streaming-manager.git
cd proxy-streaming-manager
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Iniciar con Docker Compose:
```bash
docker-compose up --build
```

## Desarrollo Local

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar en modo desarrollo:
```bash
npm run dev
```

## Administración

### Gestión de Servicios
- Acceder al panel de administración
- Ir a "Servicios de Streaming"
- Agregar nuevos servicios con:
  - Nombre del servicio
  - URL base
  - Logo
  - Configuraciones específicas

### Gestión de Cuentas
- Crear cuentas para servicios configurados
- Establecer límites de usuarios
- Monitorear uso actual

## Seguridad

- Autenticación mediante JWT
- Variables de entorno para credenciales
- Rate limiting y protección contra ataques
- Logs de seguridad
- Proxy reverso con validación de tokens

## Documentación

- [Guía de Usuario](./docs/user-guide.md)
- [Manual de Administración](./docs/admin-guide.md)
- [API Reference](./docs/api-reference.md)
- [Arquitectura](./docs/architecture.md)

## Licencia

MIT