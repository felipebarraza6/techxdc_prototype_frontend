import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientForm from '../../components/clients/ClientForm';
import { clientService } from '../../api/clientService';
import type { Client } from '../../types/client';
import { Spin, Alert, message } from 'antd';
import { useApiResource } from '../../hooks/useApiResource';

const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: clients,
    update,
    loading,
    error,
    fetchAll,
  } = useApiResource<Client, Omit<Client, 'id' | 'created_at' | 'updated_at'>>(clientService);

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (clients.length > 0 && id) {
      const found = clients.find(c => c.id === id) || null;
      setClient(found);
    }
  }, [clients, id]);

  const handleSubmit = async (values: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    await update(id!, values);
    message.success('Cliente actualizado correctamente');
    navigate('/clients');
  };

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;
  if (!client) return <Alert type="error" message="Cliente no encontrado" />;

  return (
    <div>
      <h2>Editar Cliente</h2>
      <ClientForm initialValues={client} onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default ClientEditPage;