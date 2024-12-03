# Arquitectura del Sistema

## Visión General

El sistema está diseñado siguiendo una arquitectura de microservicios, separando claramente las responsabilidades entre el frontend y backend.

## Componentes Principales

### Frontend (React + Vite)
- Panel de Administración
- Interfaz de Usuario
- Gestión de Estado (React Query)
- Sistema de Rutas (React Router)

### Backend (Node.js + Express)
- API RESTful
- Proxy Reverso
- Sistema de Autenticación
- Gestión de Base de Datos

## Flujo de Datos

1. **Autenticación**
   - Usuario accede al sistema
   - Sistema valida credenciales
   - Se genera token JWT

2. **Selección de Servicio**
   - Usuario selecciona cuenta
   - Sistema verifica permisos
   - Proxy redirige al servicio

3. **Proxy Reverso**
   - Intercepta peticiones
   - Aplica reglas de acceso
   - Gestiona sesiones

## Seguridad

### Autenticación
- JWT para tokens
- Refresh tokens
- Blacklisting de tokens

### Autorización
- RBAC (Role-Based Access Control)
- Middleware de permisos
- Validación de rutas

### Proxy
- Rate limiting
- Filtrado de cabeceras
- Sanitización de datos

## Base de Datos

### Esquema
```
Users
  - id
  - username
  - password_hash
  - role
  - created_at

Accounts
  - id
  - service
  - credentials
  - max_users
  - status

Sessions
  - id
  - user_id
  - account_id
  - started_at
  - expires_at
```

## Monitoreo

- Logs estructurados
- Métricas de uso
- Alertas de seguridad