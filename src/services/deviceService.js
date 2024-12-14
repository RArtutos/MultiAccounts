import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const DEVICES_FILE = join(process.cwd(), 'data/devices.json');

// Estructura inicial
const initialData = {
  devices: {},
  lastUpdate: new Date().toISOString()
};

async function initializeFile() {
  try {
    await readFile(DEVICES_FILE);
  } catch {
    await writeFile(DEVICES_FILE, JSON.stringify(initialData, null, 2));
  }
}

export async function registerDevice(accountName, userAgent, cookies) {
  await initializeFile();
  const data = JSON.parse(await readFile(DEVICES_FILE, 'utf8'));
  
  const deviceId = Buffer.from(userAgent).toString('base64');
  
  if (!data.devices[accountName]) {
    data.devices[accountName] = {};
  }
  
  data.devices[accountName][deviceId] = {
    userAgent,
    cookies,
    lastAccess: new Date().toISOString()
  };
  
  await writeFile(DEVICES_FILE, JSON.stringify(data, null, 2));
  return deviceId;
}

export async function getDeviceCookies(accountName, userAgent) {
  try {
    const data = JSON.parse(await readFile(DEVICES_FILE, 'utf8'));
    const deviceId = Buffer.from(userAgent).toString('base64');
    
    return data.devices[accountName]?.[deviceId]?.cookies || null;
  } catch {
    return null;
  }
}