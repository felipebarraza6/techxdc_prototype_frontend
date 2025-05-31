import { useReducer } from "react";
import UserContext from "./UserContext";
import { userReducer } from "./UserReducer";
import axiosInstance from '../api/config';
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

  const loginUser = async (userData: LoginUserData) => {
    try {
      const res = await axiosInstance.post("/api/users/login", userData);

      if (!res.data) {
        throw new Error("Datos de login incompletos");
      }

      const userDataToStore = {
        token: res.data.token,
        id: res.data.id,
        name: res.data.name,
        lastName: res.data.lastName,
        email: res.data.email,
      };

      localStorage.setItem("userData", JSON.stringify(userDataToStore));

      dispatch({
        type: 'LOGIN',
        payload: userDataToStore,
      });

      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Record<string, string>;
      }>;
      
      const errorMessage = axiosError.response?.data?.message || 
                          axiosError.message || 
                          "Error desconocido en el login";
      
      console.error("Error al iniciar sesión:", errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("userData");

    dispatch({ type: 'LOGOUT' });

    return true;
  };

  return (
    <UserContext.Provider value={{ globalState, loginUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};