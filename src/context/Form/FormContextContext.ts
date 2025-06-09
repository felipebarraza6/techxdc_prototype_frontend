import { createContext } from 'react';
import type { FormState } from './FormContext';

export const FormContext = createContext<FormState | undefined>(undefined);