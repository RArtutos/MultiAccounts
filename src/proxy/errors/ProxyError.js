export class ProxyError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'ProxyError';
    this.originalError = originalError;
    this.timestamp = new Date();
  }

  toString() {
    return `${this.name}: ${this.message}\nTimestamp: ${this.timestamp}${
      this.originalError ? `\nOriginal error: ${this.originalError.message}` : ''
    }`;
  }
}