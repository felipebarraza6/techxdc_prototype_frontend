import React, { useState } from 'react';
import { Card, Button, Space, Modal } from 'antd';
import type { Client } from '../../types/client';
import { useNavigate } from 'react-router-dom';

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const showDeleteModal = () => setModalOpen(true);
  const handleOk = () => {
    onDelete(client.id);
    setModalOpen(false);
  };
  const handleCancel = () => setModalOpen(false);

  return (
    <>
      <Card
        title={client.name}
        extra={
          <Space>
            <Button type="link" onClick={() => navigate(`/clients/${client.id}/edit`)}>Editar</Button>
            <Button type="link" danger onClick={showDeleteModal}>Eliminar</Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <div>Email: {client.email}</div>
        <div>Teléfono: {client.phone || '-'}</div>
        <div>Documento: {client.document_type || '-'} {client.document_number || ''}</div>
        <div>Ciudad: {client.city || '-'}</div>
        <div>País: {client.country || '-'}</div>
        <div>Dirección: {client.address || '-'}</div>
      </Card>
      <Modal
        open={modalOpen}
        title="¿Eliminar cliente?"
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Sí"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <p>¿Estás seguro de eliminar a {client.name}?</p>
      </Modal>
    </>
  );
};

export default ClientCard;