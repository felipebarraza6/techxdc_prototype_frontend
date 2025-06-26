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
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <ClientForm onSubmit={handleSubmit} isLoading={loading} />
      </Card>
    </div>
  );
};

export default ClientCreatePage;