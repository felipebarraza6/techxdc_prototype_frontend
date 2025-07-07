import React, { useState } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Alert, Typography, Space, Tag, Modal } from 'antd';
import { InfoCircleOutlined, FilterOutlined, FileTextOutlined, DeleteOutlined, DownOutlined, UpOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { useBreakpoint } from '../../hooks/useBreakpoint';

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
  const { isMobile } = useBreakpoint();

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
      <Col 
        xs={24} 
        md={8} 
        style={{ 
          background: '#fff', 
          borderRight: isMobile ? 'none' : '1px solid #e5e7eb', 
          borderBottom: isMobile ? '1px solid #e5e7eb' : 'none',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'flex-start', 
          padding: isMobile ? '16px 0' : '32px 0',
          minHeight: isMobile ? 'auto' : '80vh'
        }}
      >
        <Card style={{ 
          border: 'none', 
          boxShadow: 'none', 
          background: 'transparent', 
          width: '100%',
          padding: isMobile ? '0 16px' : '0'
        }}>
          <div style={{ 
            fontSize: isMobile ? 18 : 20, 
            fontWeight: 600, 
            marginBottom: 8, 
            color: '#2C3D66',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            Crear Ticket
          </div>
          <Text style={{ 
            color: '#64748B', 
            fontSize: isMobile ? 14 : 15, 
            marginBottom: 16, 
            display: 'block',
            textAlign: isMobile ? 'center' : 'left'
          }}>
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
            style={{ 
              marginBottom: 20, 
              background: '#F4F8FE', 
              border: '1px solid #B6D0F7', 
              borderRadius: 8, 
              color: '#3368AB', 
              fontWeight: 500,
              fontSize: isMobile ? 13 : undefined
            }}
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
      <Col 
        xs={24} 
        md={16} 
        style={{ 
          padding: isMobile ? '16px' : '32px 24px 0 24px',
          minHeight: isMobile ? 'auto' : '80vh'
        }}
      >
        {/* Título, buscador y filtro */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 8,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 0
        }}>
          <div style={{ 
            fontSize: isMobile ? 18 : 20, 
            fontWeight: 600, 
            color: '#2C3D66',
            textAlign: isMobile ? 'center' : 'left',
            width: isMobile ? '100%' : 'auto'
          }}>Mis tickets</div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            width: isMobile ? '100%' : 'auto'
          }}>
            <Input.Search 
              placeholder="Buscar tickets" 
              style={{ 
                width: isMobile ? '100%' : 200, 
                marginRight: isMobile ? 0 : 12,
                marginBottom: isMobile ? 8 : 0
              }} 
            />
            <Button 
              icon={<FilterOutlined />} 
              style={{ 
                borderRadius: 8, 
                borderColor: '#D1D5DB', 
                background: '#fff',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Filtrar
            </Button>
          </div>
        </div>
        {/* Tabs visuales */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginBottom: 20,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <span
            onClick={() => setActiveTab('abiertos')}
            style={{
              background: activeTab === 'abiertos' ? '#5B8DD9' : '#F4F8FE',
              color: activeTab === 'abiertos' ? '#fff' : '#5B8DD9',
              borderRadius: 8,
              padding: isMobile ? '4px 12px 4px 10px' : '6px 18px 6px 14px',
              fontWeight: 500,
              fontSize: isMobile ? 13 : 15,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              border: activeTab === 'abiertos' ? 'none' : '1px solid #E5ECF6',
              transition: 'all 0.2s',
              justifyContent: isMobile ? 'center' : 'flex-start',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            <FileTextOutlined style={{ marginRight: 6, fontSize: isMobile ? 15 : 17 }} />
            Tickets abiertos
            <span style={{
              background: activeTab === 'abiertos' ? '#E5ECF6' : '#fff',
              color: '#5B8DD9',
              borderRadius: 16,
              fontWeight: 600,
              fontSize: isMobile ? 13 : 15,
              padding: isMobile ? '1px 10px' : '2px 14px',
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
              padding: isMobile ? '4px 12px 4px 10px' : '6px 18px 6px 14px',
              fontWeight: 500,
              fontSize: isMobile ? 13 : 15,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              border: activeTab === 'cerrados' ? 'none' : '1px solid #E5ECF6',
              transition: 'all 0.2s',
              justifyContent: isMobile ? 'center' : 'flex-start',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            <FileTextOutlined style={{ marginRight: 6, fontSize: isMobile ? 15 : 17 }} />
            Tickets cerrados
            <span style={{
              background: activeTab === 'cerrados' ? '#E5ECF6' : '#fff',
              color: '#5B8DD9',
              borderRadius: 16,
              fontWeight: 600,
              fontSize: isMobile ? 13 : 15,
              padding: isMobile ? '1px 10px' : '2px 14px',
              marginLeft: 10,
              display: 'inline-block',
            }}>{closedTickets.length}</span>
          </span>
        </div>
        {/* Listado de tickets */}
        <Space direction="vertical" size={isMobile ? 12 : 16} style={{ width: '100%' }}>
          {(activeTab === 'abiertos' ? openTickets : closedTickets).map(ticket => {
            const isExpanded = expandedTicket === ticket.key;
            return (
              <Card key={ticket.key} style={{ borderRadius: 10, border: '1px solid #e5e7eb' }} bodyStyle={{ padding: isMobile ? 12 : 16 }}>
                <Space size="small" style={{ marginBottom: 8 }} wrap>
                  <Tag bordered={false} color="#e5e7eb" style={{ color: '#3368AB', fontWeight: 500 }}>{ticket.code}</Tag>
                  <Tag bordered={false} color="#e5e7eb" style={{ color: ticket.status === 'Cerrado' ? '#F87171' : '#568E2B', fontWeight: 500 }}>{ticket.status}</Tag>
                  <Tag bordered={false} color={ticket.priority === 'Alta' ? '#F87171' : ticket.priority === 'Media' ? '#FBBF24' : '#A3E635'} style={{ color: '#fff', fontWeight: 500 }}>{ticket.priority}</Tag>
                </Space>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 8 : 0
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: 600, 
                      color: '#2C3D66', 
                      fontSize: isMobile ? 14 : 15, 
                      marginBottom: 4 
                    }}>
                      {ticket.title}
                    </div>
                    <div style={{ 
                      color: '#64748B', 
                      fontSize: isMobile ? 13 : 14, 
                      marginBottom: 8 
                    }}>{ticket.description}</div>
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#94A3B8', 
                    textAlign: isMobile ? 'left' : 'right', 
                    minWidth: isMobile ? 'auto' : 120, 
                    cursor: 'pointer', 
                    userSelect: 'none' }}
                    onClick={() => setExpandedTicket(isExpanded ? null : ticket.key)}
                  >
                    Creado: {ticket.created}<br />Actualizado: {ticket.updated} {isExpanded ? <UpOutlined /> : <DownOutlined />}
                  </div>
                </div>
                {/* Historial expandible */}
                {isExpanded && (
                  <div style={{ marginTop: 16, borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
                    <div style={{ 
                      fontWeight: 500, 
                      color: '#2C3D66', 
                      marginBottom: 8,
                      fontSize: isMobile ? 14 : undefined
                    }}>Comentarios</div>
                    <div style={{ marginBottom: 12 }}>
                      {dummyComments.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                          <div style={{ 
                            width: isMobile ? 28 : 32, 
                            height: isMobile ? 28 : 32, 
                            borderRadius: isMobile ? 14 : 16, 
                            background: c.type === 'soporte' ? '#3368AB' : '#94A3B8', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#fff', 
                            fontWeight: 600, 
                            fontSize: isMobile ? 14 : 16 
                          }}>
                            {c.type === 'soporte' ? <InfoCircleOutlined /> : <UserOutlined />}
                          </div>
                          <div>
                            <div style={{ 
                              fontWeight: 500, 
                              color: c.type === 'soporte' ? '#3368AB' : '#2C3D66', 
                              fontSize: isMobile ? 13 : 14 
                            }}>{c.author}</div>
                            <div style={{ 
                              color: '#64748B', 
                              fontSize: isMobile ? 13 : 14 
                            }}>{c.text}</div>
                            <div style={{ 
                              fontSize: 12, 
                              color: '#94A3B8', 
                              marginTop: 2 
                            }}>{c.date}</div>
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
                    <Button 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDelete(ticket.key)}
                      size={isMobile ? 'small' : 'middle'}
                    >
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