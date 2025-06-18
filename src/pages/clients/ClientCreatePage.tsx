import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, message } from 'antd';
import ClientForm from '../../components/clients/ClientForm';
import { clientService } from '../../api/clientService';
import type { Client } from '../../types/client';
import { useApiResource } from '../../hooks/useApiResource';

const { Title } = Typography;

const ClientCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const {
    create,
    loading,
  } = useApiResource<Client, Omit<Client, 'id' | 'created_at' | 'updated_at'>>(clientService);

  const handleSubmit = async (values: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    await create(values);
    message.success('Cliente creado correctamente');
    navigate('/clients');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f0f2f5',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <Card
        style={{
          width: '480px',
          maxWidth: '90%',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          margin: '32px 0',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          Crear Cliente
        </Title>
        <ClientForm onSubmit={handleSubmit} isLoading={loading} />
      </Card>
    </div>
  );
};

export default ClientCreatePage;