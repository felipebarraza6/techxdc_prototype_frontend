import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}
