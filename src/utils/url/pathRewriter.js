export function createPathRewriter(accountPrefix) {
  return (path) => {
    // Si la URL ya tiene nuestro prefijo, la dejamos como está
    if (path.startsWith(accountPrefix)) {
      return path;
    }

    // Para URLs absolutas que empiezan con /
    if (path.startsWith('/')) {
      return `${accountPrefix}${path}`;
    }

    // Para URLs relativas
    return `${accountPrefix}/${path}`;
  };
}