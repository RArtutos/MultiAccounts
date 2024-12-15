export class HeaderManager {
  static sanitizeHeaders(headers) {
    const sanitized = {};
    for (const [key, value] of Object.entries(headers)) {
      if (value !== undefined && value !== null) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  static mergeHeaders(original, additional) {
    return this.sanitizeHeaders({
      ...original,
      ...additional
    });
  }

  static removeProblematicHeaders(headers) {
    const problematic = [
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'strict-transport-security'
    ];

    const cleaned = { ...headers };
    problematic.forEach(header => {
      delete cleaned[header.toLowerCase()];
    });

    return cleaned;
  }
}