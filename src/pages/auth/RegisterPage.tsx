import React, { useState } from 'react';
import { Typography, Card } from 'antd';
import RegisterForm from '../../components/auth/RegisterForm';
import authService from '../../api/authService';
import type { RegisterFormValues } from '../../components/auth/RegisterForm';
import { FormProvider } from '../../context/Form/FormContext'; // Importa desde FormContext

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async (values: RegisterFormValues) => {
    setIsLoading(true);
    const result = await authService.register(values.email, values.password);
    setIsLoading(false);

    if (result.success) {
      console.log('Registro exitoso (simulado):', result.message);
    } else {
      console.error('Registro fallido (simulado):', result.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f0f2f5',
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <Card
        style={{
          width: '480px',
          maxWidth: '90%',
          height: 'auto',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          Registrarse en Ikolu
        </Title>
        <FormProvider>
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </FormProvider>
      </Card>
    </div>
  );
};

export default RegisterPage;