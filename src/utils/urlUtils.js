export function getServiceDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}