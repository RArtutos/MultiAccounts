import path from 'path';

export function getVelocityDistPath() {
  return path.join(process.cwd(), 'src/velocity/dist');
}

export function isStaticPath(reqPath) {
  return reqPath.startsWith('/velocity/');
}

export function createPathRewriter(prefix) {
  return {
    [`^${prefix}/[^/]+/`]: '/'
  };
}