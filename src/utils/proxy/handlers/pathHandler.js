export class PathHandler {
  constructor(staticHandler) {
    this.staticHandler = staticHandler;
  }

  createPathRewrite(accountPrefix) {
    return (path) => {
      if (this.staticHandler.isStaticResource(path)) {
        return path;
      }

      if (path.includes('http://') || path.includes('https://')) {
        const matches = path.match(/\/stream\/[^/]+\/(.+)/);
        return matches ? `/${matches[1]}` : path;
      }

      return path.startsWith(accountPrefix) ? 
        path.slice(accountPrefix.length) || '/' : 
        path;
    };
  }
}