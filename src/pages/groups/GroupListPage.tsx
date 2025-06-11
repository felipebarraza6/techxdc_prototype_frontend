import React, { useEffect, useState } from 'react';
import { Button, Spin, Alert, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../api/groupService';
import type { Group } from '../../types/group';
import GroupCard from '../../components/groups/GroupCard';

const GroupListPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.list();
      setGroups(data);
    } catch {
      setError('Error al cargar los grupos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (id: string) => {
    const success = await groupService.remove(id);
    if (success) {
      message.success('Grupo eliminado correctamente');
      fetchGroups();
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