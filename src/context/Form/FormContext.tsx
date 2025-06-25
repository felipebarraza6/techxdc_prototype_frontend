import { useState } from 'react';
import type { ReactNode } from 'react';
import { FormContext } from './FormContextContext';

export interface FormValues {
  [key: string]: string | number | boolean | undefined | null;
}

export interface FormState<T extends FormValues = FormValues> {
  values: T;
  errors: Record<keyof T, string>;
  setFieldValue: (field: string, value: T[string]) => void;
  setFieldError: (field: string, error: string) => void;
  resetForm: () => void;
  setFormData: (data: Partial<T>) => void;
}

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldValue: FormState['setFieldValue'] = (field, value) => {
    setValues(v => ({ ...v, [field]: value }));
  };
  const setFieldError: FormState['setFieldError'] = (field, error) => {
    setErrors(e => ({ ...e, [field]: error }));
  };
  const resetForm = () => {
    setValues({});
    setErrors({});
  };
  const setFormData: FormState['setFormData'] = (data) => {
    setValues(v => ({ ...v, ...data }));
  };

  return (
    <FormContext.Provider value={{ values, errors, setFieldValue, setFieldError, resetForm, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};