import React, { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { FormProvider } from '../../context/Form/FormContext';
import { useUser } from '../../hooks/useUser';
import styles from './LoginPage.module.css';
import logoIkolu from '../../assets/img/28af0370e8dff1ff9a5425f2c0c073a186072776.png';
import logoSmartHydro from '../../assets/img/aa7df3241adfdd64e28732b13db3b6d3da44e47a.png';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loginUser } = useUser();

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    const success = await loginUser(values);
    setIsLoading(false);

    if (success) {
      console.log('Login exitoso');
    } else {
      console.error('Login fallido');
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