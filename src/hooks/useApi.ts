import { useState } from 'react';
import axios from '../api/config';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async <T>(url: string): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchData };
};
