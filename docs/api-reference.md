# API Reference

## Autenticación

### POST /api/auth/login
Login de usuario.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string"
  }
}
```

## Cuentas

### GET /api/accounts
Lista todas las cuentas disponibles.

**Response:**
```json
{
  "accounts": [
    {
      "id": "string",
      "service": "string",
      "status": "string",
      "currentUsers": "number",
      "maxUsers": "number"
    }
  ]
}
```

### POST /api/accounts
Crea una nueva cuenta.

**Request:**
```json
{
  "service": "string",
  "credentials": {
    "username": "string",
    "password": "string"
  },
  "maxUsers": "number"
}
```

## Sesiones

### POST /api/sessions
Inicia una nueva sesión.

**Request:**
```json
{
  "accountId": "string"
}
```

**Response:**
```json
{
  "sessionId": "string",
  "redirectUrl": "string"
}
```

## Errores

Los errores siguen el formato:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Códigos comunes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests