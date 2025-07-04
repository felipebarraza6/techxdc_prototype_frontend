import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface HeaderActionsContextType {
  headerActions: ReactNode | null;
  setHeaderActions: (actions: ReactNode | null) => void;
}

const HeaderActionsContext = createContext<HeaderActionsContextType | undefined>(undefined);

export const useHeaderActions = () => {
  const context = useContext(HeaderActionsContext);
  if (context === undefined) {
    throw new Error('useHeaderActions must be used within a HeaderActionsProvider');
  }
  return context;
};

interface HeaderActionsProviderProps {
  children: ReactNode;
}

export const HeaderActionsProvider: React.FC<HeaderActionsProviderProps> = ({ children }) => {
  const [headerActions, setHeaderActions] = useState<ReactNode | null>(null);

  return (
    <HeaderActionsContext.Provider value={{ headerActions, setHeaderActions }}>
      {children}
    </HeaderActionsContext.Provider>
  );
}; 