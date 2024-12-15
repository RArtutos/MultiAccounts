export class SubdomainExtractor {
  constructor(baseDomain) {
    this.baseDomain = baseDomain;
  }

  extract(host) {
    if (!host || host === this.baseDomain) {
      return null;
    }

    const subdomain = host.replace(`.${this.baseDomain}`, '');
    return this.isValidSubdomain(subdomain) ? subdomain : null;
  }

  isValidSubdomain(subdomain) {
    // Validar que el subdominio solo contenga caracteres válidos
    // Letras, números, guiones y espacios
    return /^[a-zA-Z0-9\s-]+$/.test(subdomain);
  }
}