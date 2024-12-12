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

export async function addAccount(name, url, maxUsers) {
  const { accounts } = await getAccounts();
  
  if (accounts.some(acc => acc.name === name)) {
    throw new Error('Ya existe una cuenta con ese nombre');
  }

  const newAccount = {
    name,
    url,
    status: 'Available',
    maxUsers: parseInt(maxUsers, 10),
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

export async function deleteAccount(name) {
  const { accounts } = await getAccounts();
  const index = accounts.findIndex(acc => acc.name === name);
  
  if (index === -1) {
    throw new Error('Cuenta no encontrada');
  }

  accounts.splice(index, 1);
  await saveAccounts(accounts);
}

export async function updateAccountMaxUsers(name, maxUsers) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  account.maxUsers = parseInt(maxUsers, 10);
  await saveAccounts(accounts);
  return account;
}

export async function updateAccountUrl(name, url) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  account.url = url;
  await saveAccounts(accounts);
  return account;
}

export async function toggleAccountStatus(name) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  account.status = account.status === 'Available' ? 'In Use' : 'Available';
  await saveAccounts(accounts);
  return account;
}

export async function updateAccountCookies(name, cookie) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  if (!account.cookies) {
    account.cookies = {};
  }

  account.cookies[cookie.name] = cookie.value;
  await saveAccounts(accounts);
  return account;
}

export async function deleteAccountCookie(name, cookieName) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account || !account.cookies) {
    throw new Error('Cuenta o cookie no encontrada');
  }

  delete account.cookies[cookieName];
  await saveAccounts(accounts);
  return account;
}

export async function kickUser(name, userId) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  account.currentUsers = account.currentUsers.filter(user => user !== userId);
  
  if (account.currentUsers.length === 0) {
    account.status = 'Available';
  }
  
  await saveAccounts(accounts);
  return account;
}

export async function updateAccountStats(name, { totalAccesses, lastAccess, peakConcurrentUsers }) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  account.stats = {
    totalAccesses: totalAccesses ?? account.stats.totalAccesses,
    lastAccess: lastAccess ?? account.stats.lastAccess,
    peakConcurrentUsers: peakConcurrentUsers ?? account.stats.peakConcurrentUsers
  };

  await saveAccounts(accounts);
  return account;
}