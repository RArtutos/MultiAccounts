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

export async function addAccount(name, url, maxUsers, platform, icon, tags = []) {
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
    icon: icon || 'https://i.ibb.co/vVTrtdH/Icono-video.png',
    tags,
    currentUsers: [],
    cookies: {},
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
  const filteredAccounts = accounts.filter(acc => acc.name !== name);
  
  if (filteredAccounts.length === accounts.length) {
    throw new Error('Account not found');
  }
  
  await saveAccounts(filteredAccounts);
  return true;
}

export async function toggleAccountStatus(name) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === name);
  
  if (!account) {
    throw new Error('Account not found');
  }
  
  account.status = account.status === 'Available' ? 'Blocked' : 'Available';
  await saveAccounts(accounts);
  return account;
}

export async function addCookie(accountName, cookieName, cookieValue) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === accountName);
  
  if (!account) {
    throw new Error('Account not found');
  }

  if (!account.cookies) {
    account.cookies = {};
  }

  account.cookies[cookieName] = cookieValue;
  await saveAccounts(accounts);
  return account;
}

export async function removeCookie(accountName, cookieName) {
  const { accounts } = await getAccounts();
  const account = accounts.find(acc => acc.name === accountName);
  
  if (!account) {
    throw new Error('Account not found');
  }

  if (account.cookies && cookieName in account.cookies) {
    delete account.cookies[cookieName];
    await saveAccounts(accounts);
  }

  return account;
}