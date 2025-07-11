import type { Client } from '../types/client';

const mockNames = [
  'Elena Nito',
  'Lola Mento',
  'Elba Lazo',
  'Alquimistas Digitales',
  'Elvis Cocho',
  'Susana Horia',
  'Pozos y Riegos Ltda.',
  'Armando Ruido',
  'Pozos Barraza',
  'Soila Vaca'
];

export const clientsMock: Client[] = Array.from({ length: 10 }, (_, i) => ({
  id: `mock-${i+1}`,
  name: mockNames[i],
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