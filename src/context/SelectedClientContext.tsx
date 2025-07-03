import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Client } from '../types/client';

interface SelectedClientContextType {
  selectedClient: Client | null;
  setSelectedClient: (client: Client) => void;
}

const SelectedClientContext = createContext<SelectedClientContextType | undefined>(undefined);

export const SelectedClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClient, setSelectedClientState] = useState<Client | null>(null);

  // Leer de localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem('selectedClient');
    if (stored) {
      try {
        setSelectedClientState(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Guardar en localStorage al cambiar
  const setSelectedClient = (client: Client) => {
    setSelectedClientState(client);
    localStorage.setItem('selectedClient', JSON.stringify(client));
  };

  return (
    <SelectedClientContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </SelectedClientContext.Provider>
  );
};

export function useSelectedClient() {
  const context = useContext(SelectedClientContext);
  if (!context) throw new Error('useSelectedClient must be used within a SelectedClientProvider');
  return context;
} 