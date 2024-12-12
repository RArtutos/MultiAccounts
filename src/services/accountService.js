import { readFile, writeFile } from 'fs/promises';
import { config } from '../config/index.js';

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
  } catch (error) {
    console.error('Error saving accounts:', error);
    throw error;
  }
}

export async function addAccount(name, url) {
  const data = await getAccounts();
  data.accounts.push({
    name,
    url,
    status: 'Available',
    cookies: {}
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