import { message } from 'antd'; 

interface User {
  email: string;
  password?: string;
  token?: string;
}

const simulateNetworkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const saveUserToLocalStorage = (user: User) => {
  const users = JSON.parse(localStorage.getItem('simulated_users') || '[]');
  const existingUserIndex = users.findIndex((u: User) => u.email === user.email);
  if (existingUserIndex > -1) {
    users[existingUserIndex] = { ...users[existingUserIndex], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem('simulated_users', JSON.stringify(users));
};

const getUserByEmail = (email: string): User | undefined => {
  const users = JSON.parse(localStorage.getItem('simulated_users') || '[]');
  return users.find((u: User) => u.email === email);
};

const authService = {
  login: async (email: string, password: string): Promise<{ success: boolean; message: string; token?: string }> => {
    await simulateNetworkDelay(1000);

    const user = getUserByEmail(email);

    if (user && user.password === password) {
      const token = `mock_token_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_token', token);
      message.success('Login exitoso'); 
      return { success: true, message: 'Login exitoso', token };
    } else {
      message.error('Email o contraseña incorrectos'); 
      return { success: false, message: 'Email o contraseña incorrectos' };
    }
  },

  register: async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    await simulateNetworkDelay(1000);

    const user = getUserByEmail(email);
    if (user) {
      message.error('El email ya está registrado'); 
      return { success: false, message: 'El email ya está registrado' };
    } else {
      saveUserToLocalStorage({ email, password });
      message.success('Registro exitoso. Ahora puedes iniciar sesión.'); 
      return { success: true, message: 'Registro exitoso. Ahora puedes iniciar sesión.' };
    }
  },

  recoverPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    await simulateNetworkDelay(1000);

    const user = getUserByEmail(email);
    if (user) {
      message.success('Se ha enviado un enlace de recuperación a tu email.'); 
      return { success: true, message: 'Se ha enviado un enlace de recuperación a tu email.' };
    } else {
      message.error('El email no está registrado.'); 
      return { success: false, message: 'El email no está registrado.' };
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem('user_token');
  },

  logout: async (): Promise<void> => {
    await simulateNetworkDelay(500);
    localStorage.removeItem('user_token');
    message.info('Sesión cerrada correctamente'); 
  }
};

export default authService;