import { readFile, writeFile } from 'fs/promises';
import { config } from '../config/index.js';
import { EventEmitter } from 'events';

export const accountEvents = new EventEmitter();

export async function getAccounts() {
  try {
    const data = await readFile(config.dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading accounts:', error);
    return { accounts: [] };
  }
}

export async function saveAccounts(accounts) {
  try {
    await writeFile(config.dataPath, JSON.stringify(accounts, null, 2));
    accountEvents.emit('accountsUpdated', accounts);
  } catch (error) {
    console.error('Error saving accounts:', error);
    throw error;
  }
}

// ... resto del código existente sin cambios ...