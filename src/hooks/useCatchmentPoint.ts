import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import axios from '../api/config';

export type CatchmentPoint = {
  id: number;
  created: string;
  modified: string;
  title: string;
  code: string | null; // Código del pozo, ej: OB_xxxxx
  is_thethings: boolean;
  is_tdata: boolean;
  is_novus: boolean;
  frecuency: string;
  project: number;
  owner_user: number;
  users_viewers: number[];
};

export type CatchmentsApiResponse = {
  
    id: number;
    projectId: number;
    title: string;
    ownerUser: number;
    id_api_telemetry: number;
    code_dga: string;
    token_api_telemetry: string;
}

type NewCatchmentPoint = Omit<CatchmentPoint, 'id' | 'created' | 'modified'>;

export const useCatchmentPoint = () => {
  const { loading, error, fetchData } = useApi();
  const [catchmentPoints, setCatchmentPoints] = useState<CatchmentPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState<CatchmentPoint | null>(null);

  const getAll = useCallback(async () => {
    try {
      console.log('Llamando a getAll...');
      const data = await fetchData<{
        count: number;
        next: string | null;
        previous: string | null;
        results: CatchmentPoint[];
      }>('/api/catchment_point/');

      if (data) {
        console.log('Datos recibidos:', data.results.length, 'puntos de captación');
        setCatchmentPoints(data.results);
      } else {
        console.warn('No se recibieron datos del endpoint');
      }
      return data;
    } catch (err) {
      console.error('Error en getAll:', err);
      return null;
    }
  }, [fetchData]);

  const getById = useCallback(async (id: number) => {
    const data = await fetchData<CatchmentPoint>(`/api/catchment_point/${id}/`);
    if (data) setCurrentPoint(data);
    return data;
  }, [fetchData]);

  const create = useCallback(async (data: NewCatchmentPoint) => {
    try {
      const response = await axios.post<CatchmentPoint>('/api/catchment_point/', data);
      setCatchmentPoints(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const update = useCallback(async (id: number, data: Partial<NewCatchmentPoint>) => {
    try {
      const response = await axios.put<CatchmentPoint>(`/api/catchment_point/${id}/`, data);
      setCatchmentPoints(prev => prev.map(cp => (cp.id === id ? response.data : cp)));
      setCurrentPoint(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const patch = useCallback(async (id: number, data: Partial<NewCatchmentPoint>) => {
    try {
      const response = await axios.patch<CatchmentPoint>(`/api/catchment_point/${id}/`, data);
      setCatchmentPoints(prev => prev.map(cp => (cp.id === id ? response.data : cp)));
      setCurrentPoint(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      await axios.delete(`/api/catchment_point/${id}/`);
      setCatchmentPoints(prev => prev.filter(cp => cp.id !== id));
      if (currentPoint?.id === id) setCurrentPoint(null);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [currentPoint?.id]);

  return {
    loading,
    error,
    catchmentPoints,
    currentPoint,
    getAll,
    getById,
    create,
    update,
    patch,
    remove,
  };
};