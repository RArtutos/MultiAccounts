# Streaming Accounts Proxy

Un proxy inverso optimizado para servicios de streaming, diseñado para gestionar múltiples cuentas y proporcionar acceso controlado.

## Características

- Proxy inverso de alto rendimiento con soporte para WebSocket
- Gestión de cookies y sesiones por cuenta
- Reescritura inteligente de URLs y contenido dinámico
- Panel de administración para gestionar cuentas
- Interfaz de usuario moderna y responsive

## Requisitos

- Node.js 18 o superior
- Docker y Docker Compose (opcional)

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

## Desarrollo

```bash
# Modo desarrollo
npm run dev
```

## Docker

```bash
# Construir e iniciar contenedores
docker-compose up -d

# Detener contenedores
docker-compose down
```

## Configuración

El proyecto utiliza variables de entorno para su configuración:

- `PORT`: Puerto del servidor (default: 3000)
- `ADMIN_USER`: Usuario administrador
- `ADMIN_PASSWORD`: Contraseña administrador

## Estructura del Proyecto

```
.
├── data/                  # Datos persistentes
├── src/
│   ├── config/           # Configuración
│   ├── middleware/       # Middleware Express
│   ├── routes/          # Rutas de la API
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   └── views/           # Plantillas y componentes
├── public/              # Archivos estáticos
└── docker-compose.yml   # Configuración Docker
```

## Licencia

MIT