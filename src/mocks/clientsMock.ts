import type { Client } from '../types/client';

export const clientsMock: Client[] = Array.from({ length: 10 }, (_, i) => ({
  id: `mock-${i+1}`,
  name: 'Nombre de Cliente',
  email: `cliente${i+1}@correo.com`,
  phone: `+56 9 1234 56${String(i).padStart(2, '0')}`,
  address: `Dirección ${i+1}`,
  document_type: 'RUT',
  document_number: `1234567${i}`,
  city: 'Santiago',
  country: 'Chile',
  created_at: '',
  updated_at: '',
  group_id: '',
})); 