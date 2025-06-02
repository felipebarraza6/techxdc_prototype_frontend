// src/pages/auth/RecoverPasswordPage.tsx
import React, { useState } from 'react';
import { Typography, Card } from 'antd';
import RecoverPasswordForm from '../../components/auth/RecoverPasswordForm';
import authService from '../../api/authService';
import type { RecoverPasswordFormValues } from '../../components/auth/RecoverPasswordForm';

const { Title } = Typography;

const RecoverPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRecoverPassword = async (values: RecoverPasswordFormValues) => {
    setIsLoading(true);
    const result = await authService.recoverPassword(values.email);
    setIsLoading(false);

    if (result.success) {
      console.log('Recuperación exitosa (simulada):', result.message);
    } else {
      console.error('Recuperación fallida (simulada):', result.message);
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
          Recuperar Contraseña
        </Title>
        <RecoverPasswordForm onSubmit={handleRecoverPassword} isLoading={isLoading} />
      </Card>
    </div>
  );
};

export default RecoverPasswordPage;