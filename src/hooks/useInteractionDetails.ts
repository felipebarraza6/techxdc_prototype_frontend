import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export type InteractionDetail = {
  id: number;
  created: string;
  modified: string;
  date_time_medition: string;
  date_time_last_logger: string;
  days_not_conection: number;
  flow: string;
  pulses: number;
  total: number;
  total_diff: number;
  total_today_diff: number;
  nivel: string;
  water_table: string;
  send_dga: boolean;
  return_dga: string | null;
  n_voucher: string | null;
  is_error: boolean;
  catchment_point: number;
  notification: string | null;
};

export const useInteractionDetails = () => {
  const { loading, error, fetchData } = useApi();
  const [interactions, setInteractions] = useState<InteractionDetail[]>([]);

  const getAllInteractions = useCallback(async () => {
    const data = await fetchData<{
      count: number;
      next: string | null;
      previous: string | null;
      results: InteractionDetail[];
    }>('/api/interaction_detail_json');

    if (data) setInteractions(data.results);
    return data;
  }, [fetchData]);

  const getInteractionsByCatchmentPoint = useCallback(async (catchmentPoint: number) => {
    const url = `/api/interaction_detail_json?catchment_point=${catchmentPoint}`;
    const data = await fetchData<{
      count: number;
      next: string | null;
      previous: string | null;
      results: InteractionDetail[];
    }>(url);

    if (data) setInteractions(data.results);
    return data;
  }, [fetchData]);

  return {
    loading,
    error,
    interactions,
    getAllInteractions,
    getInteractionsByCatchmentPoint
  };
};
