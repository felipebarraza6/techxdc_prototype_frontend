import { useFormContext } from '../context/Form/useFormContext';

export const useAuthPayload = () => {
  const { values } = useFormContext();

  // Construye el payload para login
  const getLoginPayload = () => ({
    email: values.email ?? '',
    password: values.password ?? '',
  });

  // Construye el payload para registro
  const getRegisterPayload = () => ({
    username: values.username ?? '',
    email: values.email ?? '',
    first_name: values.first_name ?? '',
    last_name: values.last_name ?? '',
    password: values.password ?? '',
  });

  return { getLoginPayload, getRegisterPayload };
};