export const CACHEABLE_TYPES = [
  'image/',
  'font/',
  'application/javascript',
  'text/css',
  'application/json',
  'application/xml'
];

export const EXCLUDED_HEADERS = [
  'content-encoding',
  'content-length',
  'content-security-policy',
  'transfer-encoding',
  'connection'
];

export function setCacheHeaders(res, contentType) {
  if (CACHEABLE_TYPES.some(type => contentType?.includes(type))) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  } else {
    res.setHeader('Cache-Control', 'no-store');
  }
}