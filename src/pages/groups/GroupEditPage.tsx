import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, Alert, message } from 'antd';
import GroupForm from '../../components/groups/GroupForm';
import { groupService } from '../../api/groupService';
import type { Group } from '../../types/group';
import { useApiResource } from '../../hooks/useApiResource';

const { Title } = Typography;

const GroupEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: groups,
    update,
    loading,
    error,
    fetchAll,
  } = useApiResource<Group, Omit<Group, 'id' | 'created_at' | 'updated_at'>>(groupService);

  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (groups.length > 0 && id) {
      const found = groups.find(g => g.id === id) || null;
      setGroup(found);
    }
  }, [groups, id]);

  const handleSubmit = async (values: Omit<Group, 'id' | 'created_at' | 'updated_at'>) => {
    await update(id!, values);
    message.success('Grupo actualizado correctamente');
    navigate('/groups');
  };

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;
  if (!group) return <Alert type="error" message="Grupo no encontrado" />;

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
          Editar Grupo
        </Title>
        <GroupForm initialValues={group!} onSubmit={handleSubmit} isLoading={loading} />
      </Card>
    </div>
  );
};

export default GroupEditPage;