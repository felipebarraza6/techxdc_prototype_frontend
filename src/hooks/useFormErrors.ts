import { useState, useCallback } from 'react';

type Errors<T extends object> = Partial<Record<keyof T, string>>;

export function useFormErrors<T extends object = object>() {
  const [errors, setErrors] = useState<Errors<T>>({});

  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors((prev: Errors<T>) => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev: Errors<T>) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
  };
}