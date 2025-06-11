import React, { useState } from 'react';
import { Card, Button, Space, Modal } from 'antd';
import type { Group } from '../../types/group';
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
  group: Group;
  onDelete: (id: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onDelete }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const showDeleteModal = () => setModalOpen(true);
  const handleOk = () => {
    onDelete(group.id);
    setModalOpen(false);
  };
  const handleCancel = () => setModalOpen(false);

  return (
    <>
      <Card
        title={group.name}
        extra={
          <Space>
            <Button type="link" onClick={() => navigate(`/groups/${group.id}/edit`)}>Editar</Button>
            <Button type="link" danger onClick={showDeleteModal}>Eliminar</Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <div>{group.description || <span style={{ color: '#aaa' }}>Sin descripción</span>}</div>
      </Card>
      <Modal
        open={modalOpen}
        title="¿Eliminar grupo?"
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Sí"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <p>¿Estás seguro de eliminar el grupo <b>{group.name}</b>?</p>
      </Modal>
    </>
  );
};

export default GroupCard;