import { useState } from 'react';
import { useApi } from './useApi';
import axios from '../api/config';

export type SchemeCatchment = {
  id: number;
  created: string;
  modified: string;
  name: string;
  description: string;
  points_catchment: number[];
};

export type NewSchemeCatchment = Omit<SchemeCatchment, 'id' | 'created' | 'modified'>;

export const useSchemesCatchment = () => {
  const { loading, error, fetchData } = useApi();
  const [schemes, setSchemes] = useState<SchemeCatchment[]>([]);
  const [currentScheme, setCurrentScheme] = useState<SchemeCatchment | null>(null);

  const getAllSchemes = async () => {
    const data = await fetchData<{
      count: number;
      next: string | null;
      previous: string | null;
      results: SchemeCatchment[];
    }>('/api/schemes_catchment/');

    if (data) setSchemes(data.results);
    return data;
  };

  const getSchemeById = async (id: number) => {
    const data = await fetchData<SchemeCatchment>(`/api/schemes_catchment/${id}/`);
    if (data) setCurrentScheme(data);
    return data;
  };

  const createScheme = async (data: NewSchemeCatchment) => {
    try {
      const response = await axios.post<SchemeCatchment>('/api/schemes_catchment/', data);
      setSchemes(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateScheme = async (id: number, data: Partial<NewSchemeCatchment>) => {
    try {
      const response = await axios.put<SchemeCatchment>(`/api/schemes_catchment/${id}/`, data);
      setSchemes(prev => prev.map(s => (s.id === id ? response.data : s)));
      setCurrentScheme(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const patchScheme = async (id: number, data: Partial<NewSchemeCatchment>) => {
    try {
      const response = await axios.patch<SchemeCatchment>(`/api/schemes_catchment/${id}/`, data);
      setSchemes(prev => prev.map(s => (s.id === id ? response.data : s)));
      setCurrentScheme(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const deleteScheme = async (id: number) => {
    try {
      await axios.delete(`/api/schemes_catchment/${id}/`);
      setSchemes(prev => prev.filter(s => s.id !== id));
      if (currentScheme?.id === id) setCurrentScheme(null);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    loading,
    error,
    schemes,
    currentScheme,
    getAllSchemes,
    getSchemeById,
    createScheme,
    updateScheme,
    patchScheme,
    deleteScheme,
  };
};
