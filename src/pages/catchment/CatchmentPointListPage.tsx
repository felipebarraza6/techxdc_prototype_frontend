import React, { useEffect } from 'react';
import { Button, Table, Spin, Alert, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCatchmentPoint } from '../../hooks/useCatchmentPoint';
import type { CatchmentPoint } from '../../hooks/useCatchmentPoint';
import { useProjectList } from '../../hooks/useProjectList';
import { useNavigate } from 'react-router-dom';

const CatchmentPointListPage: React.FC = () => {
  const {
    loading,
    error,
    catchmentPoints,
    getAll,
    remove,
  } = useCatchmentPoint();

  const { projects } = useProjectList();
  const navigate = useNavigate();

  useEffect(() => {
    getAll();
  }, [getAll]);

  const handleDelete = async (id: number) => {
    try {
      await remove(id);
      message.success('Punto de captación eliminado');
      getAll();
    } catch {
      message.error('Error al eliminar');
    }
  };

  const columns: ColumnsType<CatchmentPoint> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'title', key: 'title' },
    { title: 'Frecuencia', dataIndex: 'frecuency', key: 'frecuency' },
    {
      title: 'Proyecto',
      dataIndex: 'project',
      key: 'project',
      render: (projectId: number) => {
        const project = projects.find(p => p.id === projectId);
        return project ? project.name : projectId;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="¿Seguro que deseas eliminar?"
          onConfirm={() => handleDelete(record.id)}
          okText="Sí"
          cancelText="No"
        >
          <Button danger size="small">
            Eliminar
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h2>Puntos de Captación</h2>
      {error && <Alert type="error" message={error.toString()} />}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate('/catchment/new')}
      >
        Nuevo Punto de Captación
      </Button>
      <Spin spinning={loading}>
        <Table
          dataSource={catchmentPoints}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Spin>
    </div>
  );
};

export default CatchmentPointListPage;