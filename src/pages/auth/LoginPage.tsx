import React, { useState } from 'react';
import { App as AntdApp } from 'antd';
import LoginForm from '../../components/auth/LoginForm';
import { FormProvider } from '../../context/Form/FormContext';
import { useUser } from '../../hooks/useUser';
import styles from './LoginPage.module.css';
import logoIkolu from '../../assets/img/logoikolu.png';
import logoSmartHydro from '../../assets/img/logoempresa.png';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loginUser } = useUser();
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();

  // ===============================
  // Función de manejo del login
  // ===============================
  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const result = await loginUser(values);
      if (result.success) {
        message.success(result.message || 'Login exitoso');
        navigate('/telemetry');
      } else {
        message.error(result.message || 'Error de autenticación');
      }
      return result;
    } catch (error) {
      message.error('Error inesperado en el login');
      return { success: false, message: 'Error inesperado en el login' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={logoIkolu} alt="Ikolu Logo" className={styles.logo} />
        <span className={styles.title}>Ikolu App</span>
      </div>
      <FormProvider>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </FormProvider>
      <div className={styles.footer}>
        <img src={logoSmartHydro} alt="Smart Hydro" className={styles.companyLogo} />
      </div>
    </div>
  );
};

export default LoginPage;