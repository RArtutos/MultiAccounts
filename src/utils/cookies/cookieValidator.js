// Validación de cookies según las especificaciones de Playwright
export function validateCookie(cookie) {
  if (!cookie.name || !cookie.value) {
    return false;
  }

  // Validar el dominio si está presente
  if (cookie.domain) {
    // El dominio debe comenzar con un punto o una letra
    if (!/^[a-zA-Z0-9]|^\.[a-zA-Z0-9]/.test(cookie.domain)) {
      return false;
    }
  }

  // Validar la ruta si está presente
  if (cookie.path && !cookie.path.startsWith('/')) {
    return false;
  }

  return true;
}