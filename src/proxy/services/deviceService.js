import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

class DeviceService {
  constructor() {
    this.devicesFile = join(process.cwd(), 'data/devices.json');
    this.devices = new Map();
    this.loadDevices();
  }

  async loadDevices() {
    try {
      const data = await readFile(this.devicesFile, 'utf8');
      const devices = JSON.parse(data);
      this.devices = new Map(Object.entries(devices));
    } catch (error) {
      console.warn('No devices file found, creating new one');
      await this.saveDevices();
    }
  }

  async saveDevices() {
    const devicesObj = Object.fromEntries(this.devices);
    await writeFile(this.devicesFile, JSON.stringify(devicesObj, null, 2));
  }

  async updateDeviceCookies(accountName, cookies) {
    if (!this.devices.has(accountName)) {
      this.devices.set(accountName, { cookies: {}, lastUpdate: new Date() });
    }
    
    const device = this.devices.get(accountName);
    device.cookies = { ...device.cookies, ...cookies };
    device.lastUpdate = new Date();
    
    await this.saveDevices();
  }

  getDeviceCookies(accountName) {
    return this.devices.get(accountName)?.cookies || {};
  }
}

export const deviceService = new DeviceService();