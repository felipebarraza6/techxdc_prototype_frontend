import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientForm from '../../components/clients/ClientForm';
import { clientService } from '../../api/clientService';
import type { Client } from '../../types/client';
import { Spin, Alert } from 'antd';

const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await clientService.get(id!);
        if (!data) {
          setError('Cliente no encontrado');
        } else {
          setClient(data);
        }
      } catch {
        setError('Error al cargar el cliente');
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleSubmit = async (values: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    await clientService.update(id!, values);
    setSaving(false);
    navigate('/clients');
  };

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <h2>Editar Cliente</h2>
      <ClientForm initialValues={client!} onSubmit={handleSubmit} isLoading={saving} />
    </div>
  );
};

export default ClientEditPage;