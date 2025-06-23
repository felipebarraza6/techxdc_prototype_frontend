export interface Project {
  id: number;
  name: string;
}

const mockProjects: Project[] = [
  { id: 1, name: 'Proyecto A' },
  { id: 2, name: 'Proyecto B' },
  { id: 3, name: 'Proyecto C' },
];

export const projectService = {
  async getAll(): Promise<Project[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockProjects), 300));
  },
};