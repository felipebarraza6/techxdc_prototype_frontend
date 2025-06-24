export interface User {
  id: number;
  username: string;
  email: string;
}

const mockUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@demo.com' },
  { id: 2, username: 'operador', email: 'operador@demo.com' },
  { id: 3, username: 'viewer', email: 'viewer@demo.com' },
];

export const userService = {
  async getAll(): Promise<User[]> {
    // Simula una llamada a la API
    return new Promise(resolve => setTimeout(() => resolve(mockUsers), 300));
  },
};