export class AttributeRewriter {
  constructor(urlTransformer) {
    this.urlTransformer = urlTransformer;
    this.urlAttributes = [
      'href',
      'src',
      'action',
      'data-url',
      'content',
      'data-src',
      'data-href',
      'poster',
      'formaction'
    ];
  }

  rewrite(html) {
    let modifiedHtml = html;

    this.urlAttributes.forEach(attr => {
      const regex = new RegExp(`${attr}=(?:["']([^"']+)["']|([^ >]+))`, 'gi');
      modifiedHtml = modifiedHtml.replace(regex, (match, quotedUrl, unquotedUrl) => {
        const url = quotedUrl || unquotedUrl;
        const rewrittenUrl = this.urlTransformer.transform(url);
        return `${attr}="${rewrittenUrl}"`;
      });
    });

    return modifiedHtml;
  }
}