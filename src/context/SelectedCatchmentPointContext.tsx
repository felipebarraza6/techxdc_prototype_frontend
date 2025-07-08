import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CatchmentPoint } from '../hooks/useCatchmentPoint';
import { useApi } from '../hooks/useApi';

interface SelectedCatchmentPointContextType {
  catchmentPoints: CatchmentPoint[];
  setCatchmentPoints: React.Dispatch<React.SetStateAction<CatchmentPoint[]>>;
  selectedCatchmentPoint: CatchmentPoint | null;
  setSelectedCatchmentPoint: (cp: CatchmentPoint | null) => void;
  getAll: () => Promise<void>;
}

const SelectedCatchmentPointContext = createContext<SelectedCatchmentPointContextType | undefined>(undefined);

export const SelectedCatchmentPointProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [catchmentPoints, setCatchmentPoints] = useState<CatchmentPoint[]>([]);
  const [selectedCatchmentPoint, setSelectedCatchmentPoint] = useState<CatchmentPoint | null>(null);
  const { fetchData } = useApi();

  const getAll = useCallback(async () => {
    const data = await fetchData<{
      count: number;
      next: string | null;
      previous: string | null;
      results: CatchmentPoint[];
    }>('/api/catchment_point/');
    if (data) setCatchmentPoints(data.results);
  }, [fetchData]);

  useEffect(() => {
    if (catchmentPoints.length === 0) {
      getAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  useEffect(() => {
    console.log('Contexto actualizado: selectedCatchmentPoint', selectedCatchmentPoint);
  }, [selectedCatchmentPoint]);

  return (
    <SelectedCatchmentPointContext.Provider value={{ catchmentPoints, setCatchmentPoints, selectedCatchmentPoint, setSelectedCatchmentPoint, getAll }}>
      {children}
    </SelectedCatchmentPointContext.Provider>
  );
};

export function useSelectedCatchmentPoint() {
  const context = useContext(SelectedCatchmentPointContext);
  if (!context) {
    throw new Error('useSelectedCatchmentPoint debe usarse dentro de SelectedCatchmentPointProvider');
  }
  return context;
} 