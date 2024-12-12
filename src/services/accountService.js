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

export async function addAccount(name, url, maxUsers = 1) {
  const data = await getAccounts();
  data.accounts.push({
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
  });
  await saveAccounts(data);
  return data;
}

export async function updateAccountCookies(name, cookieData) {
  const data = await getAccounts();
  const account = data.accounts.find(a => a.name === name);
  if (account) {
    account.cookies = account.cookies || {};
    account.cookies[cookieData.name] = cookieData.value;
    await saveAccounts(data);
  }
  return data;
}

export async function deleteAccountCookie(accountName, cookieName) {
  const data = await getAccounts();
  const account = data.accounts.find(a => a.name === accountName);
  if (account && account.cookies) {
    delete account.cookies[cookieName];
    await saveAccounts(data);
  }
  return data;
}

export async function deleteAccount(name) {
  const data = await getAccounts();
  data.accounts = data.accounts.filter(a => a.name !== name);
  await saveAccounts(data);
  return data;
}

export async function toggleAccountStatus(name) {
  const data = await getAccounts();
  const account = data.accounts.find(a => a.name === name);
  if (account) {
    account.status = account.status === 'Available' ? 'In Use' : 'Available';
    await saveAccounts(data);
  }
  return data;
}

export async function updateAccountMaxUsers(name, maxUsers) {
  const data = await getAccounts();
  const account = data.accounts.find(a => a.name === name);
  if (account) {
    account.maxUsers = parseInt(maxUsers, 10);
    await saveAccounts(data);
  }
  return data;
}

export async function addUserToAccount(accountName, userId) {
  const data = await getAccounts();
  const account = data.accounts.find(a => a.name === accountName);
  
  if (!account) {
    throw new Error('Cuenta no encontrada');
  }

  if (account.currentUsers.length >= account.maxUsers) {
    throw new Error('Límite de usuarios alcanzado');
  }

  if (!account.currentUsers.includes(userId)) {
    account.currentUsers.push(userId);
    account.stats.totalAccesses++;
    account.stats.lastAccess = new Date().toISOString();
    account.stats.peakConcurrentUsers = Math.max(
      account.stats.peakConcurrentUsers,
      account.currentUsers.length
    );
    
    if (account.currentUsers.length >= account.maxUsers) {
      account.status = 'In Use';
    }
    
    await saveAccounts(data);
  }
  
  return account;
}

export async function removeUserFromAccount(accountName, userId) {
  const data = await getAccounts();
  const account = data.accounts.find(a => a.name === accountName);
  
  if (account) {
    account.currentUsers = account.currentUsers.filter(id => id !== userId);
    
    if (account.currentUsers.length < account.maxUsers) {
      account.status = 'Available';
    }
    
    await saveAccounts(data);
  }
  
  return account;
}