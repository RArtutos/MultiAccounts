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
    await writeFile(config.dataPath, JSON.stringify({ accounts }, null, 2));
    accountEvents.emit('accountsUpdated', accounts);
  } catch (error) {
    console.error('Error saving accounts:', error);
    throw error;
  }
}

export async function addAccount(name, url, maxUsers, platform = 'other', icon = '🎬', tags = []) {
  const { accounts } = await getAccounts();
  
  if (accounts.some(acc => acc.name === name)) {
    throw new Error('Ya existe una cuenta con ese nombre');
  }

  const newAccount = {
    name,
    url,
    status: 'Available',
    maxUsers: parseInt(maxUsers, 10),
    platform,
    icon,
    tags,
    currentUsers: [],
    stats: {
      totalAccesses: 0,
      lastAccess: null,
      peakConcurrentUsers: 0
    }
  };

  accounts.push(newAccount);
  await saveAccounts(accounts);
  return newAccount;
}

export async function updateAccount(name, updates) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  // Actualizar campos permitidos
  const allowedUpdates = ['url', 'maxUsers', 'platform', 'icon', 'status'];
  Object.keys(updates).forEach(key => {
    if (allowedUpdates.includes(key)) {
      account[key] = updates[key];
    }
  });

  await saveAccounts(accounts);
  return account;
}

export async function addTag(name, tag) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  if (!account.tags) {
    account.tags = [];
  }

  if (!account.tags.includes(tag)) {
    account.tags.push(tag);
    await saveAccounts(accounts);
  }

  return account;
}

export async function removeTag(name, tag) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  if (account.tags) {
    account.tags = account.tags.filter(t => t !== tag);
    await saveAccounts(accounts);
  }

  return account;
}

// Resto de las funciones existentes...