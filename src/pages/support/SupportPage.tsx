import React, { useState } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Alert, Typography, Space, Tag, Modal } from 'antd';
import { InfoCircleOutlined, FilterOutlined, FileTextOutlined, DeleteOutlined, DownOutlined, UpOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const dummyTickets = [
  {
    key: '1',
    code: 'TK-003',
    status: 'En desarrollo',
    priority: 'Alta',
    title: 'Error en lectura de sensor P2',
    description: 'El sensor del pozo P2 no está enviando datos desde ayer por la tarde',
    created: '2025-06-14',
    updated: '2025-06-15',
    closed: false,
  },
  {
    key: '2',
    code: 'TK-004',
    status: 'Pendiente',
    priority: 'Media',
    title: 'Solicitud de nuevo reporte',
    description: 'Necesito un reporte personalizado para el análisis mensual',
    created: '2025-06-15',
    updated: '2025-06-15',
    closed: false,
  },
  {
    key: '3',
    code: 'TK-002',
    status: 'Cerrado',
    priority: 'Alta',
    title: 'Problema de acceso al sistema',
    description: 'No podía acceder al dashboard principal',
    created: '2025-06-14',
    updated: '2025-06-15',
    closed: true,
  },
  {
    key: '4',
    code: 'TK-001',
    status: 'Cerrado',
    priority: 'Baja',
    title: 'Consulta sobre configuración',
    description: 'Dudas sobre la configuración de alertas',
    created: '2025-06-15',
    updated: '2025-06-15',
    closed: true,
  },
];

const dummyComments = [
  {
    author: 'Usuario',
    date: '2025-06-14 14:30',
    text: 'El sensor del pozo P2 no está enviando datos desde ayer por la tarde',
    type: 'usuario',
  },
  {
    author: 'Soporte técnico',
    date: '2025-06-14 14:40',
    text: 'Hemos identificado el problema. Estamos trabajando en la solución.',
    type: 'soporte',
  },
];

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'abiertos' | 'cerrados'>('abiertos');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<{ open: boolean; ticketKey?: string }>({ open: false });
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const openTickets = dummyTickets.filter(t => !t.closed);
  const closedTickets = dummyTickets.filter(t => t.closed);

  // Simular envío de ticket
  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  // Simular eliminación de ticket
  const handleDelete = (ticketKey: string) => {
    setDeleteModalOpen({ open: true, ticketKey });
  };

  return (
    <Row gutter={0} style={{ minHeight: '80vh', background: '#f4f6fa' }}>
      {/* Panel izquierdo: Formulario de ticket */}
      <Col span={8} style={{ background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '32px 0' }}>
        <Card style={{ border: 'none', boxShadow: 'none', background: 'transparent', width: '100%' }}>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#2C3D66' }}>
            Crear Ticket
          </div>
          <Text style={{ color: '#64748B', fontSize: 15, marginBottom: 16, display: 'block' }}>
            Describe tu problema o solicitud
          </Text>
          <Alert
            message={
              <span>
                <InfoCircleOutlined style={{ color: '#3368AB', marginRight: 8 }} />
                Nuestro equipo responderá en menos de 24 horas durante días hábiles.
              </span>
            }
            type="info"
            showIcon={false}
            style={{ marginBottom: 20, background: '#F4F8FE', border: '1px solid #B6D0F7', borderRadius: 8, color: '#3368AB', fontWeight: 500 }}
          />
          <Form layout="vertical" style={{ width: '100%', maxWidth: 340, margin: '0 auto' }} onFinish={handleCreate}>
            <Form.Item label="Título" name="titulo">
              <Input placeholder="Describe brevemente el problema" />
            </Form.Item>
            <Form.Item label="Variable" name="variable">
              <Select placeholder="Seleccione una opción">
                <Option value="var1">Variable 1</Option>
                <Option value="var2">Variable 2</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Mensaje" name="mensaje">
              <Input.TextArea placeholder="Describa su problema o solicitud..." autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button style={{ borderRadius: 8 }}>Limpiar</Button>
                <Button type="primary" htmlType="submit" style={{ background: '#568E2B', border: 'none', borderRadius: 8 }}>
                  + Crear
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      {/* Panel derecho: Listado de tickets */}
      <Col span={16} style={{ padding: '32px 24px 0 24px' }}>
        {/* Título, buscador y filtro */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#2C3D66' }}>Mis tickets</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Input.Search placeholder="Buscar tickets" style={{ width: 200, marginRight: 12 }} />
            <Button icon={<FilterOutlined />} style={{ borderRadius: 8, borderColor: '#D1D5DB', background: '#fff' }}>Filtrar</Button>
          </div>
        </div>
        {/* Tabs visuales */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <span
            onClick={() => setActiveTab('abiertos')}
            style={{
              background: activeTab === 'abiertos' ? '#5B8DD9' : '#F4F8FE',
              color: activeTab === 'abiertos' ? '#fff' : '#5B8DD9',
              borderRadius: 8,
              padding: '6px 18px 6px 14px',
              fontWeight: 500,
              fontSize: 15,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              border: activeTab === 'abiertos' ? 'none' : '1px solid #E5ECF6',
              transition: 'all 0.2s',
            }}
          >
            <FileTextOutlined style={{ marginRight: 6, fontSize: 17 }} />
            Tickets abiertos
            <span style={{
              background: activeTab === 'abiertos' ? '#E5ECF6' : '#fff',
              color: '#5B8DD9',
              borderRadius: 16,
              fontWeight: 600,
              fontSize: 15,
              padding: '2px 14px',
              marginLeft: 10,
              display: 'inline-block',
            }}>{openTickets.length}</span>
          </span>
          <span
            onClick={() => setActiveTab('cerrados')}
            style={{
              background: activeTab === 'cerrados' ? '#5B8DD9' : '#F4F8FE',
              color: activeTab === 'cerrados' ? '#fff' : '#5B8DD9',
              borderRadius: 8,
              padding: '6px 18px 6px 14px',
              fontWeight: 500,
              fontSize: 15,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              border: activeTab === 'cerrados' ? 'none' : '1px solid #E5ECF6',
              transition: 'all 0.2s',
            }}
          >
            <FileTextOutlined style={{ marginRight: 6, fontSize: 17 }} />
            Tickets cerrados
            <span style={{
              background: activeTab === 'cerrados' ? '#E5ECF6' : '#fff',
              color: '#5B8DD9',
              borderRadius: 16,
              fontWeight: 600,
              fontSize: 15,
              padding: '2px 14px',
              marginLeft: 10,
              display: 'inline-block',
            }}>{closedTickets.length}</span>
          </span>
        </div>
        {/* Listado de tickets */}
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {(activeTab === 'abiertos' ? openTickets : closedTickets).map(ticket => {
            const isExpanded = expandedTicket === ticket.key;
            return (
              <Card key={ticket.key} style={{ borderRadius: 10, border: '1px solid #e5e7eb' }} bodyStyle={{ padding: 16 }}>
                <Space size="small" style={{ marginBottom: 8 }}>
                  <Tag bordered={false} color="#e5e7eb" style={{ color: '#3368AB', fontWeight: 500 }}>{ticket.code}</Tag>
                  <Tag bordered={false} color="#e5e7eb" style={{ color: ticket.status === 'Cerrado' ? '#F87171' : '#568E2B', fontWeight: 500 }}>{ticket.status}</Tag>
                  <Tag bordered={false} color={ticket.priority === 'Alta' ? '#F87171' : ticket.priority === 'Media' ? '#FBBF24' : '#A3E635'} style={{ color: '#fff', fontWeight: 500 }}>{ticket.priority}</Tag>
                </Space>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#2C3D66', fontSize: 15, marginBottom: 4 }}>
                      {ticket.title}
                    </div>
                    <div style={{ color: '#64748B', fontSize: 14, marginBottom: 8 }}>{ticket.description}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', textAlign: 'right', minWidth: 120, cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => setExpandedTicket(isExpanded ? null : ticket.key)}
                  >
                    Creado: {ticket.created}<br />Actualizado: {ticket.updated} {isExpanded ? <UpOutlined /> : <DownOutlined />}
                  </div>
                </div>
                {/* Historial expandible */}
                {isExpanded && (
                  <div style={{ marginTop: 16, borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
                    <div style={{ fontWeight: 500, color: '#2C3D66', marginBottom: 8 }}>Comentarios</div>
                    <div style={{ marginBottom: 12 }}>
                      {dummyComments.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 16, background: c.type === 'soporte' ? '#3368AB' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 16 }}>
                            {c.type === 'soporte' ? <InfoCircleOutlined /> : <UserOutlined />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: c.type === 'soporte' ? '#3368AB' : '#2C3D66', fontSize: 14 }}>{c.author}</div>
                            <div style={{ color: '#64748B', fontSize: 14 }}>{c.text}</div>
                            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{c.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Input placeholder="Agregar comentario..." style={{ flex: 1, borderRadius: 8 }} />
                      <Button type="primary" icon={<SendOutlined />} style={{ borderRadius: 8, background: '#568E2B', border: 'none' }} />
                    </div>
                  </div>
                )}
                {/* Botón eliminar en tickets cerrados */}
                {activeTab === 'cerrados' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(ticket.key)}>
                      Eliminar
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </Space>
        {/* Modal de confirmación de creación */}
        <Modal
          open={createModalOpen}
          onOk={() => setCreateModalOpen(false)}
          onCancel={() => setCreateModalOpen(false)}
          okText="Confirmar"
          cancelText="Cancelar"
        >
          ¿Deseas crear el ticket?
        </Modal>
        {/* Modal de confirmación de eliminación */}
        <Modal
          open={deleteModalOpen.open}
          onOk={() => setDeleteModalOpen({ open: false })}
          onCancel={() => setDeleteModalOpen({ open: false })}
          okText="Eliminar"
          cancelText="Cancelar"
        >
          ¿Estás seguro que deseas eliminar este ticket?
        </Modal>
      </Col>
    </Row>
  );
};

export default SupportPage; 