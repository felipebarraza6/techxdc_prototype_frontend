import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, Alert } from 'antd';
import GroupForm from '../../components/groups/GroupForm';
import { groupService } from '../../api/groupService';
import type { Group } from '../../types/group';

const { Title } = Typography;

const GroupEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await groupService.get(id!);
        if (!data) {
          setError('Grupo no encontrado');
        } else {
          setGroup(data);
        }
      } catch {
        setError('Error al cargar el grupo');
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  const handleSubmit = async (values: Omit<Group, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    await groupService.update(id!, values);
    setSaving(false);
    navigate('/groups');
  };

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;

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
        <GroupForm initialValues={group!} onSubmit={handleSubmit} isLoading={saving} />
      </Card>
    </div>
  );
};

export default GroupEditPage;