import { useState, useCallback } from 'react';

type WithId = { id: string };

type Service<T extends WithId, CreatePayload = Partial<T>, UpdatePayload = Partial<T>> = {
  list: () => Promise<T[]>;
  get: (id: string) => Promise<T | null>;
  create: (data: CreatePayload) => Promise<T>;
  update: (id: string, data: UpdatePayload) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
};

export function useApiResource<T extends WithId, CreatePayload = Partial<T>, UpdatePayload = Partial<T>>(service: Service<T, CreatePayload, UpdatePayload>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.list();
      setData(result);
    } catch  {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [service]);

  const create = useCallback(async (payload: CreatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const created = await service.create(payload);
      setData(prev => [...prev, created]);
      return created;
    } catch (error) {
      setError('Error al crear');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const update = useCallback(async (id: string, payload: UpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await service.update(id, payload);
      if (updated) {
        setData(prev => prev.map(item => (item.id === id ? updated : item)));
      }
      return updated;
    } catch (error) {
      setError('Error al actualizar');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await service.remove(id);
      if (success) {
        setData(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (error) {
      setError('Error al eliminar');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service]);

  return {
    data,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
}