import React, { useEffect } from 'react';
import { Button, Spin, Alert, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../api/groupService';
import type { Group } from '../../types/group';
import GroupCard from '../../components/groups/GroupCard';
import { useApiResource } from '../../hooks/useApiResource';

const GroupListPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: groups,
    loading,
    error,
    fetchAll,
    remove,
  } = useApiResource<Group, Omit<Group, 'id' | 'created_at' | 'updated_at'>>(groupService);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (id: string) => {
    const success = await remove(id);
    if (success) {
      message.success('Grupo eliminado correctamente');
    } else {
      message.error('No se pudo eliminar el grupo');
    }
  };

  return (
    <div>
      <h2>Grupos</h2>
      <Button type="primary" onClick={() => navigate('/groups/create')} style={{ marginBottom: 16 }}>
        Crear Grupo
      </Button>
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        groups.map(group => (
          <GroupCard key={group.id} group={group} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default GroupListPage;