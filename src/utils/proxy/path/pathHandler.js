export class PathHandler {
  constructor(accountPrefix) {
    this.accountPrefix = accountPrefix;
  }

  rewritePath(path, isStatic) {
    if (!path) return '/';

    // Para recursos estáticos, mantener la ruta original
    if (isStatic) {
      return path;
    }

    // Para otras rutas, eliminar el prefijo de la cuenta
    return path.startsWith(this.accountPrefix) ? 
      path.slice(this.accountPrefix.length) || '/' : 
      path;
  }
}