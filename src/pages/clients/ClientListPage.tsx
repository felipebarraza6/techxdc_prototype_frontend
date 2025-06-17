import React, { useEffect, useState } from 'react';
import { Button, Spin, Alert, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../../api/clientService';
import type { Client } from '../../types/client';
import ClientCard from '../../components/clients/ClientCard';

const ClientListPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.list();
      setClients(data);
    } catch {
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    const success = await clientService.remove(id);
    if (success) {
      message.success('Cliente eliminado correctamente');
      fetchClients();
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