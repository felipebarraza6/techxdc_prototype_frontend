import { useState } from 'react';
import { useApi } from './useApi';
import axios from '../api/config';

export type ProfileDataConfig = {
  id: number;
  created: string;
  modified: string;
  token_service: string;
  d1: string;
  d2: string;
  d3: string;
  d4: string;
  d5: string;
  d6: number;
  is_telemetry: boolean;
  date_start_telemetry: string | null;
  date_delivery_act: string | null;
  point_catchment: number;
};

type NewProfileDataConfig = Omit<ProfileDataConfig, 'id' | 'created' | 'modified'>;

export const useProfileConfigCatchment = () => {
  const { loading, error, fetchData } = useApi();
  const [profileDataConfigs, setProfileDataConfigs] = useState<ProfileDataConfig[]>([]);

  const getProfileDataConfigs = async () => {
    const data = await fetchData<{
      count: number;
      next: string | null;
      previous: string | null;
      results: ProfileDataConfig[];
    }>('/api/profile_data_config_catchment/');

    if (data) setProfileDataConfigs(data.results);
    return data;
  };

  const createProfileDataConfig = async (data: NewProfileDataConfig) => {
    try {
      const response = await axios.post<ProfileDataConfig>('/api/profile_data_config_catchment/', data);
      setProfileDataConfigs(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return {
    loading,
    error,
    profileDataConfigs,
    getProfileDataConfigs,
    createProfileDataConfig,
  };
};
