export class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  set(domain, name, value, options = {}) {
    if (!this.cookies.has(domain)) {
      this.cookies.set(domain, new Map());
    }
    this.cookies.get(domain).set(name, { value, options });
  }

  get(domain, name) {
    return this.cookies.get(domain)?.get(name);
  }

  getAll(domain) {
    return Array.from(this.cookies.get(domain)?.entries() || []);
  }

  delete(domain, name) {
    this.cookies.get(domain)?.delete(name);
  }

  clear(domain) {
    this.cookies.delete(domain);
  }
}