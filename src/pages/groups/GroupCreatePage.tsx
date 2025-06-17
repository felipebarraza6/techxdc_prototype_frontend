import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography } from 'antd';
import GroupForm from '../../components/groups/GroupForm';
import { groupService } from '../../api/groupService';
import type { Group } from '../../types/group';

const { Title } = Typography;

const GroupCreatePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: Omit<Group, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    await groupService.create(values);
    setLoading(false);
    navigate('/groups');
  };

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
          Crear Grupo
        </Title>
        <GroupForm onSubmit={handleSubmit} isLoading={loading} />
      </Card>
    </div>
  );
};

export default GroupCreatePage;