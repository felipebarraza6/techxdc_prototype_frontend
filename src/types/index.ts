// Export your common types here
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

//Usuario
export interface User {
  token: string | null;
  id: string | null;
  name: string | null;
  lastName: string | null;
  email: string | null;
}

export interface UserPayload {
  token: string;
  id: string;
  name: string;
  lastName: string;
  email: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface UserState {
  user: User;
  isAuthenticated: boolean;
}

export type UserAction =
  | { type: "LOGIN"; payload: UserPayload }
  | { type: "LOGOUT" };

export interface UserContextProps {
  globalState: UserState;
  loginUser: (
    userData: LoginUserData
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<boolean>;
}

export interface UserProviderProps {
  children: React.ReactNode;
}
