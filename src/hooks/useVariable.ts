import { useState } from 'react';
import { useApi } from './useApi';
import axios from '../api/config';

export type Variable = {
  id: number;
  created: string;
  modified: string;
  str_variable: string;
  label: string;
  type_variable: string;
  token_service: string | null;
  service: string | null;
  pulses_factor: number;
  addition: number;
  convert_to_lt: boolean;
  calculate_nivel: number | null;
  scheme_catchment: number;
};

export type NewVariable = Omit<Variable, 'id' | 'created' | 'modified'>;

export const useVariable = () => {
  const { loading, error, fetchData } = useApi();
  const [variables, setVariables] = useState<Variable[]>([]);
  const [currentVariable, setCurrentVariable] = useState<Variable | null>(null);

  const getAllVariables = async () => {
    const data = await fetchData<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Variable[];
    }>('/api/variable/');
    if (data) setVariables(data.results);
    return data;
  };

  const getVariableById = async (id: number) => {
    const data = await fetchData<Variable>(`/api/variable/${id}/`);
    if (data) setCurrentVariable(data);
    return data;
  };

  const createVariable = async (data: NewVariable) => {
    try {
      const response = await axios.post<Variable>('/api/variable/', data);
      setVariables(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateVariable = async (id: number, data: Partial<NewVariable>) => {
    try {
      const response = await axios.put<Variable>(`/api/variable/${id}/`, data);
      setVariables(prev => prev.map(v => (v.id === id ? response.data : v)));
      setCurrentVariable(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const patchVariable = async (id: number, data: Partial<NewVariable>) => {
    try {
      const response = await axios.patch<Variable>(`/api/variable/${id}/`, data);
      setVariables(prev => prev.map(v => (v.id === id ? response.data : v)));
      setCurrentVariable(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const deleteVariable = async (id: number) => {
    try {
      await axios.delete(`/api/variable/${id}/`);
      setVariables(prev => prev.filter(v => v.id !== id));
      if (currentVariable?.id === id) setCurrentVariable(null);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    loading,
    error,
    variables,
    currentVariable,
    getAllVariables,
    getVariableById,
    createVariable,
    updateVariable,
    patchVariable,
    deleteVariable,
  };
};
