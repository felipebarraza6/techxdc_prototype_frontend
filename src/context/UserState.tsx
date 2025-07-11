import { useReducer } from "react";
import UserContext from "./UserContext";
import { userReducer } from "./UserReducer";
import { api_business } from '../api/config';
import type { AxiosError } from "axios";
import type { UserProviderProps, LoginUserData, UserState } from '../types/index';

export const UserProvider = ({ children }: UserProviderProps) => {
  const initialState: UserState = {
    user: {
      token: null,
      id: null,
      name: null,
      lastName: null,
      email: null,
    },
    isAuthenticated: false,
  };

  const [globalState, dispatch] = useReducer(userReducer, initialState);

  // ===============================
  // Función de Login
  // ===============================
  // Solo maneja la lógica, no muestra mensajes ni logs
  // Retorna un objeto { success, message }
  const loginUser = async (userData: LoginUserData): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api_business.post("/api/auth/login", userData);
      if (!res.data.success) {
        return { success: false, message: res.data.message || 'Error desconocido de autenticación' };
      }
      const userDataToStore = {
        token: res.data.data?.token || null,
        id: res.data.data?.user.id || null,
        username: res.data.data?.user.username || null,
        email: res.data.data?.user.email || null,
        first_name: res.data.data?.user.first_name || null,
        last_name: res.data.data?.user.last_name || null,
        rol: res.data.data?.user.rol || null,
      };
      try {
        localStorage.setItem("userData", JSON.stringify(userDataToStore));
        localStorage.setItem("catchmentPoints", JSON.stringify(res.data.data?.catchmentPoints));
        localStorage.setItem("selectedToken", res.data.data?.catchmentPoints[0].token_api_telemetry);
        localStorage.setItem("selectedId", res.data.data?.catchmentPoints[0].id_api_telemetry);
        if (userDataToStore.token) {
          localStorage.setItem("token", userDataToStore.token);
        }
      } catch (error) {
        // No hacer nada, solo evitar que rompa
      }
      // No hacemos dispatch ni cambiamos el estado global aún
      return { success: true, message: res.data.message || 'Login exitoso' };
    } catch (error) {
      let errorMessage = 'Error desconocido en el login';
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return { success: false, message: errorMessage };
    }
  };

  // ===============================
  // Función de Logout (sin cambios)
  // ===============================
  const logout = async () => {
    try {
      await api_business.post("/api/auth/logout");
    } catch (error) {}
    finally {
      try {
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
      } catch (error) {}
      dispatch({ type: 'LOGOUT' });
    }
    return true;
  };

  return (
    <UserContext.Provider value={{ globalState, loginUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};