import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { accountEvents } from './accountService.js';

const USERS_FILE = join(process.cwd(), 'data/connected_users.json');

// Estructura inicial del archivo
const initialData = {
  connections: {},
  lastUpdate: new Date().toISOString()
};

// Asegurar que el archivo existe con la estructura inicial
async function initializeFile() {
  try {
    await readFile(USERS_FILE);
  } catch {
    await writeFile(USERS_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Leer el estado actual
async function readCurrentState() {
  try {
    const data = await readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    await initializeFile();
    return initialData;
  }
}

// Guardar el estado
async function saveState(state) {
  await writeFile(USERS_FILE, JSON.stringify(state, null, 2));
  accountEvents.emit('accountsUpdated');
}

export async function trackUserConnection(accountName, userId) {
  const state = await readCurrentState();
  
  if (!state.connections[accountName]) {
    state.connections[accountName] = new Set();
  }
  
  state.connections[accountName].add(userId);
  state.lastUpdate = new Date().toISOString();
  
  await saveState({
    ...state,
    connections: Object.fromEntries(
      Object.entries(state.connections).map(([key, value]) => [key, Array.from(value)])
    )
  });
  
  return Array.from(state.connections[accountName]).length;
}

export async function removeUserConnection(accountName, userId) {
  const state = await readCurrentState();
  
  if (state.connections[accountName]) {
    const users = new Set(state.connections[accountName]);
    users.delete(userId);
    state.connections[accountName] = Array.from(users);
    state.lastUpdate = new Date().toISOString();
    
    await saveState(state);
  }
}

export async function getConnectedUsers(accountName) {
  const state = await readCurrentState();
  return state.connections[accountName] || [];
}

// Limpiar conexiones antiguas (ejecutar periódicamente)
export async function cleanupOldConnections() {
  const state = await readCurrentState();
  const now = new Date();
  const timeout = 5 * 60 * 1000; // 5 minutos
  
  for (const accountName in state.connections) {
    if (new Date(state.lastUpdate).getTime() + timeout < now.getTime()) {
      delete state.connections[accountName];
    }
  }
  
  await saveState(state);
}