export class ScriptRewriter {
  constructor(urlTransformer) {
    this.urlTransformer = urlTransformer;
    this.patterns = [
      {
        // Redirecciones directas
        regex: /(?:window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
        handler: (match, url) => match.replace(url, this.urlTransformer.transform(url))
      },
      {
        // Funciones de navegación
        regex: /(?:window\.open|location\.replace|location\.assign)\(["']([^"']+)["']/gi,
        handler: (match, url) => match.replace(url, this.urlTransformer.transform(url))
      },
      {
        // Peticiones AJAX
        regex: /(?:fetch|axios|\.open\(['"](?:GET|POST|PUT|DELETE|PATCH)["'],\s*)["']([^"']+)["']/gi,
        handler: (match, url) => match.replace(url, this.urlTransformer.transform(url))
      },
      {
        // Redirecciones sin comillas
        regex: /(?:window\.location|location|window\.location\.href|location\.href)\s*=\s*([^"'\s;]+)/gi,
        handler: (match, url) => match.replace(url, this.urlTransformer.transform(url))
      }
    ];
  }

  rewrite(html) {
    let modifiedHtml = html;
    this.patterns.forEach(({ regex, handler }) => {
      modifiedHtml = modifiedHtml.replace(regex, handler.bind(this));
    });
    return modifiedHtml;
  }
}