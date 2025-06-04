// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { Typography, Card } from 'antd';
import LoginForm from '../../components/auth/LoginForm';
import authService from '../../api/authService';

const { Title } = Typography;

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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f0f2f5',
      padding: '20px',
      boxSizing: 'border-box',
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
          Iniciar Sesión en Ikolu
        </Title>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </Card>
    </div>
  );
};

export default LoginPage;