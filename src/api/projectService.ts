export interface Project {
  id: number;
  name: string;
  code: string;
}

const mockProjects: Project[] = [
  { id: 1, name: 'Proyecto A', code: 'OB-0902-77' },
  { id: 2, name: 'Proyecto B', code: 'OB-0902-88' },
  { id: 3, name: 'Proyecto C', code: 'OB-0902-99' },
];

export const projectService = {
  async getAll(): Promise<Project[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockProjects), 300));
  },
};