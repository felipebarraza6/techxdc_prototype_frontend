import React, { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import authService from '../../api/authService';
import { FormProvider } from '../../context/Form/FormContext';
import styles from './LoginPage.module.css';
import logoIkolu from '../../assets/img/28af0370e8dff1ff9a5425f2c0c073a186072776.png';
import logoSmartHydro from '../../assets/img/aa7df3241adfdd64e28732b13db3b6d3da44e47a.png';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    const result = await authService.login(values.email, values.password);
    setIsLoading(false);

    if (result.success) {
      console.log('Login exitoso (simulado):', result.message);
    } else {
      console.error('Login fallido (simulado):', result.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <img src={logoIkolu} alt="Ikolu Logo" className={styles.logo} />
          <span className={styles.title}>Ikolu App</span>
        </div>
        <FormProvider>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </FormProvider>
        <div className={styles.info}>
          Para mayor información o problemas de acceso<br />
          envíanos un correo a <b>soporte@smarthydo.cl</b>
        </div>
        <img src={logoSmartHydro} alt="Smart Hydro" className={styles.companyLogo} />
      </div>
    </div>
  );
};

export default LoginPage;