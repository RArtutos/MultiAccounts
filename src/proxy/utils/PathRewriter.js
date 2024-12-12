export class PathRewriter {
  rewrite(path, req) {
    // Si tenemos una ruta original guardada, la usamos
    if (req.originalPath) {
      return req.originalPath;
    }

    // Extraer la parte de la ruta después de /stream/accountName
    const match = path.match(/\/stream\/[^/]+(.*)/) || [null, '/'];
    return match[1] || '/';
  }
}