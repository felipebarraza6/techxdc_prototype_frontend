import type { Group } from '../types/group';

const LOCAL_STORAGE_KEY = 'simulated_groups';

const simulateNetworkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getGroupsFromStorage = (): Group[] => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
};

const saveGroupsToStorage = (groups: Group[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(groups));
};

export const groupService = {
  async list(): Promise<Group[]> {
    await simulateNetworkDelay(500);
    return getGroupsFromStorage();
  },
  async get(id: string): Promise<Group | null> {
    await simulateNetworkDelay(500);
    const groups = getGroupsFromStorage();
    return groups.find(g => g.id === id) || null;
  },
  async create(group: Omit<Group, 'id' | 'created_at' | 'updated_at'>): Promise<Group> {
    await simulateNetworkDelay(500);
    const groups = getGroupsFromStorage();
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    groups.push(newGroup);
    saveGroupsToStorage(groups);
    return newGroup;
  },
  async update(id: string, group: Partial<Omit<Group, 'id' | 'created_at' | 'updated_at'>>): Promise<Group | null> {
    await simulateNetworkDelay(500);
    const groups = getGroupsFromStorage();
    const idx = groups.findIndex(g => g.id === id);
    if (idx === -1) return null;
    groups[idx] = {
      ...groups[idx],
      ...group,
      updated_at: new Date().toISOString(),
    };
    saveGroupsToStorage(groups);
    return groups[idx];
  },
  async remove(id: string): Promise<boolean> {
    await simulateNetworkDelay(500);
    let groups = getGroupsFromStorage();
    const initialLength = groups.length;
    groups = groups.filter(g => g.id !== id);
    saveGroupsToStorage(groups);
    return groups.length < initialLength;
  }
};