import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectService } from '../api/projectService';
import type { Project } from '../api/projectService';

interface SelectedProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
}

const SelectedProjectContext = createContext<SelectedProjectContextType | undefined>(undefined);

export const SelectedProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProject, setSelectedProjectState] = useState<Project | null>(null);

  useEffect(() => {
    projectService.getAll().then((data) => {
      setSelectedProjectState(data[0] || null);
    });
  }, []);

  const setSelectedProject = (project: Project) => {
    setSelectedProjectState(project);
  };

  return (
    <SelectedProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </SelectedProjectContext.Provider>
  );
};

export function useSelectedProject() {
  const context = useContext(SelectedProjectContext);
  if (!context) throw new Error('useSelectedProject must be used within a SelectedProjectProvider');
  return context;
} 