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
  const [dailyInteractions, setDailyInteractions] = useState<InteractionDetail[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [previousPageUrl, setPreviousPageUrl] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

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

const getInteractionsByCatchmentPoint = useCallback(async (catchmentPoint: number, page: number = 1) => {
  const url = `/api/interaction_detail_json?catchment_point=${catchmentPoint}&limit=20&page=${page}`;
  const data = await fetchData<{
    count: number;
    next: string | null;
    previous: string | null;
    results: InteractionDetail[];
  }>(url);

  if (data) {
    setInteractions(data.results);
    setNextPageUrl(data.next);
    setPreviousPageUrl(data.previous);
    setTotalCount(data.count);
  }
  return data;
}, [fetchData]);

  const getInteractionDetailOverride = useCallback(
    async (
        catchment_point: number, 
        month: number, 
        dayRange: string
      ) => {
      const url = `/api/interaction_detail_override?catchment_point=${catchment_point}&date_time_medition__month=${month}&date_time_medition__day__range=${dayRange}`;
      console.log('URL overrideMethod:', url);
      const data = await fetchData<InteractionDetail[]>(url);
      if (Array.isArray(data)) {
        setDailyInteractions(data);
      } else {
        setDailyInteractions([]);
      }
      return data;
    },
    [fetchData]
  );

  const getInteractionDetailOneDay = useCallback(
    async (
        catchment_point: number, 
        month: number, 
        day: number
      ) => {
      const url = `/api/interaction_detail_override?catchment_point=${catchment_point}&date_time_medition__month=${month}&date_time_medition__day=${day}`;
      const data = await fetchData<InteractionDetail[]>(url);
      if (Array.isArray(data)) {
        setDailyInteractions(data);
      } else {
        setDailyInteractions([]);
      }
      return data;
    },
    [fetchData]
  );

  const getInteractionDetailOneMonth = useCallback(
    async (
        catchment_point: number, 
        month: number, 
      ) => {
      const url = `/api/interaction_detail_override?catchment_point=${catchment_point}&date_time_medition__month=${month}`;
      const data = await fetchData<InteractionDetail[]>(url);
      if (Array.isArray(data)) {
        setDailyInteractions(data);
      } else {
        setDailyInteractions([]);
      }
      return data;
    },
    [fetchData]
  );

  return {
    loading,
    error,
    interactions,
    getAllInteractions,
    getInteractionsByCatchmentPoint,
    getInteractionDetailOverride,
    getInteractionDetailOneDay,
    getInteractionDetailOneMonth,
    dailyInteractions,
    nextPageUrl,
    previousPageUrl,
    totalCount,
  };
};
