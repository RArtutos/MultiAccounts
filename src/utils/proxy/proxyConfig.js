import { StreamingProxyConfig } from './streaming/streamingProxyConfig.js';

export function createProxyConfig(account, req, targetDomain) {
  const streamingProxy = new StreamingProxyConfig(account, req, targetDomain);
  return streamingProxy.createConfig();
}