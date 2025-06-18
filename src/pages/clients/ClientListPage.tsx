import React, { useEffect } from 'react';
import { Button, Spin, Alert, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../../api/clientService';
import type { Client } from '../../types/client';
import ClientCard from '../../components/clients/ClientCard';
import { useApiResource } from '../../hooks/useApiResource';

const ClientListPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: clients,
    loading,
    error,
    fetchAll,
    remove,
  } = useApiResource<Client, Omit<Client, 'id' | 'created_at' | 'updated_at'>>(clientService);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (id: string) => {
    const success = await remove(id);
    if (success) {
      message.success('Cliente eliminado correctamente');
    } else {
      message.error('No se pudo eliminar el cliente');
    }
  };

  return (
    <div>
      <h2>Clientes</h2>
      <Button type="primary" onClick={() => navigate('/clients/create')} style={{ marginBottom: 16 }}>
        Crear Cliente
      </Button>
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        clients.map(client => (
          <ClientCard key={client.id} client={client} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default ClientListPage;