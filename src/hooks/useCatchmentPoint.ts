import { useState } from 'react';
import { useApi } from './useApi';
import axios from '../api/config';

export type CatchmentPoint = {
  id: number;
  created: string;
  modified: string;
  title: string;
  is_thethings: boolean;
  is_tdata: boolean;
  is_novus: boolean;
  frecuency: string;
  project: number;
  owner_user: number;
  users_viewers: number[];
};

type NewCatchmentPoint = Omit<CatchmentPoint, 'id' | 'created' | 'modified'>;

export const useCatchmentPoint = () => {
  const { loading, error, fetchData } = useApi();
  const [catchmentPoints, setCatchmentPoints] = useState<CatchmentPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState<CatchmentPoint | null>(null);

    const getAll = async () => {
    const data = await fetchData<{
        count: number;
        next: string | null;
        previous: string | null;
        results: CatchmentPoint[];
    }>('/api/catchment_point/');

    if (data) setCatchmentPoints(data.results);
    return data;
    };

  const getById = async (id: number) => {
    const data = await fetchData<CatchmentPoint>(`/api/catchment_point/${id}/`);
    if (data) setCurrentPoint(data);
    return data;
  };

  const create = async (data: NewCatchmentPoint) => {
    try {
      const response = await axios.post<CatchmentPoint>('/api/catchment_point/', data);
      setCatchmentPoints(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const update = async (id: number, data: Partial<NewCatchmentPoint>) => {
    try {
      const response = await axios.put<CatchmentPoint>(`/api/catchment_point/${id}/`, data);
      setCatchmentPoints(prev => prev.map(cp => (cp.id === id ? response.data : cp)));
      setCurrentPoint(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const patch = async (id: number, data: Partial<NewCatchmentPoint>) => {
    try {
      const response = await axios.patch<CatchmentPoint>(`/api/catchment_point/${id}/`, data);
      setCatchmentPoints(prev => prev.map(cp => (cp.id === id ? response.data : cp)));
      setCurrentPoint(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const remove = async (id: number) => {
    try {
      await axios.delete(`/api/catchment_point/${id}/`);
      setCatchmentPoints(prev => prev.filter(cp => cp.id !== id));
      if (currentPoint?.id === id) setCurrentPoint(null);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

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