import { useContext } from 'react';
import { FormContext } from './FormContextContext';

export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used within a FormProvider');
  return ctx;
};