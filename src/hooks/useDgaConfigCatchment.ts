import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import axios from '../api/config';

export type DgaDataConfig = {
  id: number;
  created: string;
  modified: string;
  send_dga: boolean;
  standard: string;
  type_dga: string;
  code_dga: string | null;
  flow_granted_dga: string;
  total_granted_dga: number | null;
  shac: string | null;
  date_start_compliance: string | null;
  date_created_code: string | null;
  name_informant: string;
  rut_report_dga: string;
  password_dga_software: string;
  point_catchment: number;
};

export type NewDgaDataConfig = Omit<DgaDataConfig, 'id' | 'created' | 'modified'>;

export const useDgaConfigCatchment = () => {
  const { loading, error, fetchData } = useApi();
  const [dgaConfigs, setDgaConfigs] = useState<DgaDataConfig[]>([]);
  const [currentDgaConfig, setCurrentDgaConfig] = useState<DgaDataConfig | null>(null);

  const getAllDgaConfigs = useCallback(async () => {
    const data = await fetchData<{
      count: number;
      next: string | null;
      previous: string | null;
      results: DgaDataConfig[];
    }>('/api/dga_data_config_catchment/');
    if (data) setDgaConfigs(data.results);
    return data;
  }, [fetchData]);

  const getDgaConfigById = useCallback(async (id: number) => {
    const selectedId = localStorage.getItem("selectedId");
    if (selectedId) {
      id = parseInt(selectedId);
    }
    const data = await fetchData<DgaDataConfig>(`/api/dga_data_config_catchment/${id}/`);
    if (data) setCurrentDgaConfig(data);
    return data;
  }, [fetchData]);

  const createDgaConfig = useCallback(async (data: NewDgaDataConfig) => {
    try {
      const response = await axios.post<DgaDataConfig>('/api/dga_data_config_catchment/', data);
      setDgaConfigs(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const updateDgaConfig = useCallback(async (id: number, data: Partial<NewDgaDataConfig>) => {
    try {
      const response = await axios.put<DgaDataConfig>(`/api/dga_data_config_catchment/${id}/`, data);
      setDgaConfigs(prev => prev.map(cfg => (cfg.id === id ? response.data : cfg)));
      setCurrentDgaConfig(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const patchDgaConfig = useCallback(async (id: number, data: Partial<NewDgaDataConfig>) => {
    try {
      const response = await axios.patch<DgaDataConfig>(`/api/dga_data_config_catchment/${id}/`, data);
      setDgaConfigs(prev => prev.map(cfg => (cfg.id === id ? response.data : cfg)));
      setCurrentDgaConfig(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const deleteDgaConfig = useCallback(async (id: number) => {
    try {
      await axios.delete(`/api/dga_data_config_catchment/${id}/`);
      setDgaConfigs(prev => prev.filter(cfg => cfg.id !== id));
      if (currentDgaConfig?.id === id) setCurrentDgaConfig(null);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [currentDgaConfig]);

  return {
    loading,
    error,
    dgaConfigs,
    currentDgaConfig,
    getAllDgaConfigs,
    getDgaConfigById,
    createDgaConfig,
    updateDgaConfig,
    patchDgaConfig,
    deleteDgaConfig,
  };
};
