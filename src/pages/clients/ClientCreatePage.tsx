import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, message } from 'antd'; 
import ClientForm from '../../components/clients/ClientForm';
import { clientService } from '../../api/clientService';
import type { Client } from '../../types/client';
import { useApiResource } from '../../hooks/useApiResource';
import styles from './ClientCreatePage.module.css';

const ClientCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const {
    create,
    loading,
  } = useApiResource<Client, Omit<Client, 'id' | 'created_at' | 'updated_at'>>(clientService);

  const handleSubmit = async (values: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    await create(values);
    message.success('Cliente criado corretamente');
    navigate('/clients');
  };

  return (
    <div className={styles.pageContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: 'transparent' }}>
      <Card
        className={styles.formCard}
        bordered={true}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 12px 0 rgba(44,61,102,0.07)',
          border: '1px solid #E5E7EB',
          padding: 0,
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
        }}
        bodyStyle={{ padding: 32 }}
      >
        <ClientForm onSubmit={handleSubmit} isLoading={loading} />
      </Card>
    </div>
  );
};

export default ClientCreatePage;