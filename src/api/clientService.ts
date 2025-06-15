import type { Client } from '../types/client';

const LOCAL_STORAGE_KEY = 'simulated_clients';

const simulateNetworkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getClientsFromStorage = (): Client[] => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
};

const saveClientsToStorage = (clients: Client[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
};

export const clientService = {
  async list(): Promise<Client[]> {
    await simulateNetworkDelay(500);
    return getClientsFromStorage();
  },
  async get(id: string): Promise<Client | null> {
    await simulateNetworkDelay(500);
    const clients = getClientsFromStorage();
    return clients.find(c => c.id === id) || null;
  },
  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    await simulateNetworkDelay(500);
    const clients = getClientsFromStorage();
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    clients.push(newClient);
    saveClientsToStorage(clients);
    return newClient;
  },
  async update(id: string, client: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>): Promise<Client | null> {
    await simulateNetworkDelay(500);
    const clients = getClientsFromStorage();
    const idx = clients.findIndex(c => c.id === id);
    if (idx === -1) return null;
    clients[idx] = {
      ...clients[idx],
      ...client,
      updated_at: new Date().toISOString(),
    };
    saveClientsToStorage(clients);
    return clients[idx];
  },
  async remove(id: string): Promise<boolean> {
    await simulateNetworkDelay(500);
    let clients = getClientsFromStorage();
    const initialLength = clients.length;
    clients = clients.filter(c => c.id !== id);
    saveClientsToStorage(clients);
    return clients.length < initialLength;
  }
};