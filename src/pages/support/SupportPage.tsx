import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Alert, Typography, Space, Tag, Modal, Spin, message } from 'antd';
import { InfoCircleOutlined, FilterOutlined, FileTextOutlined, DeleteOutlined, DownOutlined, UpOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import axios from 'axios';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';

const { Option } = Select;
const { Text } = Typography;

// Tipos para tickets, comentarios y variables
interface Ticket {
  id: number;
  title: string;
  description?: string;
  priority: string;
  createdAt?: string;
  updatedAt?: string;
  custom_fields?: Record<string, any>;
  status?: string;
}

interface TicketStatus {
  id: number;
  ticketId: number;
  status: string;
}

interface TicketComment {
  id: number;
  ticket_id: number;
  user_id: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface Variable {
  id: number;
  label: string;
  type_variable: string;
}

const SupportPage: React.FC = () => {
  const [form] = Form.useForm();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'abiertos' | 'cerrados'>('abiertos');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<{ open: boolean; ticketId?: number }>({ open: false });
  const [expandedTicket, setExpandedTicket] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, TicketComment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [commentLoading, setCommentLoading] = useState<Record<number, boolean>>({});
  const { isMobile } = useBreakpoint();
  const { selectedCatchmentPoint } = useSelectedCatchmentPoint();

  // Cargar tickets y estados
  useEffect(() => {
    async function fetchTicketsAndStatus() {
      setLoading(true);
      setError(null);
      try {
        const [ticketsRes, statusRes] = await Promise.all([
          axios.get('/api/tickets/'),
          axios.get('/api/status-tickets/')
        ]);
        const ticketsData: Ticket[] = Array.isArray(ticketsRes.data.data) ? ticketsRes.data.data : [];
        const statusData: TicketStatus[] = Array.isArray(statusRes.data.data) ? statusRes.data.data : [];
        // Mapear el estado actual a cada ticket (el último status por ticketId)
        const statusMap: Record<number, string> = {};
        const statusIdMap: Record<number, number> = {};
        statusData.forEach((s) => {
          if (!statusIdMap[s.ticketId] || (s.id > statusIdMap[s.ticketId])) {
            statusMap[s.ticketId] = s.status;
            statusIdMap[s.ticketId] = s.id;
          }
        });
        const merged: Ticket[] = ticketsData.map((t) => ({
          ...t,
          status: statusMap[t.id] || 'open',
        }));
        setTickets(merged);
      } catch (err) {
        setError((err as Error).message || 'Error al cargar tickets');
      } finally {
        setLoading(false);
      }
    }
    fetchTicketsAndStatus();
  }, []);

  // Cargar variables de smarthydro
  useEffect(() => {
    async function fetchVariables() {
      try {
        const res = await axios.get('https://api.smarthydro.app/api/variable/', {
          headers: { Authorization: 'Token 07e5d496bd9ad1a3edfda2d94f7b5b238ee94f97' }
        });
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.results)
            ? res.data.results
            : Array.isArray(res.data.data)
              ? res.data.data
              : [];
        setVariables(arr);
      } catch (e) {
        setVariables([]);
      }
    }
    fetchVariables();
  }, []);

  // Filtrar variables únicas por label
  const uniqueVariables = variables.filter(
    (v, i, arr) => arr.findIndex(x => x.label === v.label) === i
  );

  // Cargar comentarios de un ticket
  const fetchComments = async (ticketId: number) => {
    try {
      const res = await axios.get(`/api/response-tickets/?ticket_id=${ticketId}`);
      setComments((prev) => ({ ...prev, [ticketId]: Array.isArray(res.data.data) ? res.data.data : [] }));
    } catch (e) {
      setComments((prev) => ({ ...prev, [ticketId]: [] }));
    }
  };

  // Al expandir un ticket, cargar comentarios si no están cargados
  useEffect(() => {
    if (expandedTicket && comments[expandedTicket] === undefined) {
      fetchComments(expandedTicket);
    }
  }, [expandedTicket]);

  // Filtrar tickets abiertos/cerrados
  const openTickets = tickets.filter(t => t.status !== 'closed');
  const closedTickets = tickets.filter(t => t.status === 'closed');

  // Crear ticket
  const handleCreate = async (values: any) => {
    setCreateModalOpen(true);
  };

  // Confirmar creación de ticket
  const handleConfirmCreate = async () => {
    try {
      const values = form.getFieldsValue();
      const selectedVariable = variables.find(v => v.id === values.variable);
      const payload = {
        title: values.titulo,
        description: values.mensaje,
        priority: 'Media',
        created_by: 123, // TO-DO: Reemplazar por el id real del usuario cuando esté disponible
        designated: 123, // TO-DO: Reemplazar por el id real del designado cuando esté disponible
        catchment_point_id: selectedCatchmentPoint?.id, // id del pozo en la raíz
        custom_fields: {
          variableId: values.variable,
          variableName: selectedVariable ? selectedVariable.label : undefined,
        },
      };
      await axios.post('/api/tickets/', payload);
      message.success('Ticket creado exitosamente');
      setCreateModalOpen(false);
      form.resetFields();
      // Refrescar tickets
      const ticketsRes = await axios.get('/api/tickets/');
      const ticketsData: Ticket[] = Array.isArray(ticketsRes.data.data) ? ticketsRes.data.data : [];
      setTickets(ticketsData);
    } catch (err: any) {
      if (err.errorFields) {
        // Error de validación del formulario
        return;
      }
      message.error(err.response?.data?.message || err.message || 'Error al crear el ticket');
      setCreateModalOpen(false);
    }
  };

  // Crear comentario
  const handleAddComment = async (ticketId: number) => {
    const comment = commentInputs[ticketId];
    if (!comment) return;
    setCommentLoading((prev) => ({ ...prev, [ticketId]: true }));
    try {
      await axios.post('/api/response-tickets/', {
        ticket_id: ticketId,
        user_id: 123, // TO-DO: Reemplazar por el id real del usuario cuando esté disponible
        comment,
      });
      setCommentInputs((prev) => ({ ...prev, [ticketId]: '' }));
      fetchComments(ticketId);
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message || 'Error al agregar comentario');
    } finally {
      setCommentLoading((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  // Eliminar ticket
  const handleDelete = async (ticketId: number) => {
    try {
      await axios.delete(`/api/tickets/${ticketId}`);
      message.success('Ticket eliminado');
      setDeleteModalOpen({ open: false });
      // Refrescar tickets
      const ticketsRes = await axios.get('/api/tickets/');
      const ticketsData: Ticket[] = Array.isArray(ticketsRes.data.data) ? ticketsRes.data.data : [];
      setTickets(ticketsData);
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message || 'Error al eliminar el ticket');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f4f6fa' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px', background: '#f4f6fa', minHeight: '80vh' }}>
        <Alert message="Error al cargar tickets" description={error} type="error" showIcon />
      </div>
    );
  }

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
          <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 600, marginBottom: 8, color: '#2C3D66', textAlign: isMobile ? 'center' : 'left' }}>
            Crear Ticket
          </div>
          <Text style={{ color: '#64748B', fontSize: isMobile ? 14 : 15, marginBottom: 16, display: 'block', textAlign: isMobile ? 'center' : 'left' }}>
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
            style={{ marginBottom: 20, background: '#F4F8FE', border: '1px solid #B6D0F7', borderRadius: 8, color: '#3368AB', fontWeight: 500, fontSize: isMobile ? 13 : undefined }}
          />
          <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 340, margin: '0 auto' }} onFinish={handleCreate}>
            <Form.Item label="Título" name="titulo" rules={[{ required: true, message: 'Ingrese un título' }]}> 
              <Input placeholder="Describe brevemente el problema" />
            </Form.Item>
            <Form.Item label="Variable" name="variable" rules={[{ required: true, message: 'Seleccione una variable' }]}> 
              <Select placeholder="Seleccione una opción" showSearch optionFilterProp="children">
                {uniqueVariables.map((v) => (
                  <Option key={v.id} value={v.id}>{v.label}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Mensaje" name="mensaje" rules={[{ required: true, message: 'Ingrese un mensaje' }]}> 
              <Input.TextArea placeholder="Describa su problema o solicitud..." autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button style={{ borderRadius: 8 }} onClick={() => form.resetFields()}>Limpiar</Button>
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
        style={{ padding: isMobile ? '16px' : '32px 24px 0 24px', minHeight: isMobile ? 'auto' : '80vh' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0 }}>
          <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 600, color: '#2C3D66', textAlign: isMobile ? 'center' : 'left', width: isMobile ? '100%' : 'auto' }}>Mis tickets</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: isMobile ? '100%' : 'auto' }}>
            <Input.Search placeholder="Buscar tickets" style={{ width: isMobile ? '100%' : 200, marginRight: isMobile ? 0 : 12, marginBottom: isMobile ? 8 : 0 }} />
            <Button icon={<FilterOutlined />} style={{ borderRadius: 8, borderColor: '#D1D5DB', background: '#fff', width: isMobile ? '100%' : 'auto' }}>
              Filtrar
            </Button>

          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexDirection: isMobile ? 'column' : 'row' }}>
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
            <span style={{ background: activeTab === 'abiertos' ? '#E5ECF6' : '#fff', color: '#5B8DD9', borderRadius: 16, fontWeight: 600, fontSize: isMobile ? 13 : 15, padding: isMobile ? '1px 10px' : '2px 14px', marginLeft: 10, display: 'inline-block' }}>{openTickets.length}</span>
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
            <span style={{ background: activeTab === 'cerrados' ? '#E5ECF6' : '#fff', color: '#5B8DD9', borderRadius: 16, fontWeight: 600, fontSize: isMobile ? 13 : 15, padding: isMobile ? '1px 10px' : '2px 14px', marginLeft: 10, display: 'inline-block' }}>{closedTickets.length}</span>
          </span>
        </div>
        <Space direction="vertical" size={isMobile ? 12 : 16} style={{ width: '100%' }}>
          {(activeTab === 'abiertos' ? openTickets : closedTickets).map(ticket => {
            const isExpanded = expandedTicket === ticket.id;
            return (
              <Card key={ticket.id} style={{ borderRadius: 10, border: '1px solid #e5e7eb' }} bodyStyle={{ padding: isMobile ? 12 : 16 }}>
                <Space size="small" style={{ marginBottom: 8 }} wrap>
                  <Tag bordered={false} color="#e5e7eb" style={{ color: '#3368AB', fontWeight: 500 }}>{`TK-${ticket.id.toString().padStart(3, '0')}`}</Tag>
                  <Tag bordered={false} color="#e5e7eb" style={{ color: ticket.status === 'closed' ? '#F87171' : '#568E2B', fontWeight: 500 }}>{ticket.status === 'closed' ? 'Cerrado' : 'En desarrollo'}</Tag>
                  <Tag bordered={false} color={ticket.priority === 'Alta' ? '#F87171' : ticket.priority === 'Media' ? '#FBBF24' : '#A3E635'} style={{ color: '#fff', fontWeight: 500 }}>{ticket.priority}</Tag>
                </Space>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 8 : 0 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#2C3D66', fontSize: isMobile ? 14 : 15, marginBottom: 4 }}>{ticket.title}</div>
                    <div style={{ color: '#64748B', fontSize: isMobile ? 13 : 14, marginBottom: 8 }}>{ticket.description}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', textAlign: isMobile ? 'left' : 'right', minWidth: isMobile ? 'auto' : 120, cursor: 'pointer', userSelect: 'none' }} onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}>
                    Creado: {ticket.createdAt ? new Date(ticket.createdAt).toISOString().split('T')[0] : 'N/A'}<br />Actualizado: {ticket.updatedAt ? new Date(ticket.updatedAt).toISOString().split('T')[0] : 'N/A'} {isExpanded ? <UpOutlined /> : <DownOutlined />}
                  </div>
                </div>
                {/* Historial expandible */}
                {isExpanded && (
                  <div style={{ marginTop: 16, borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
                    <div style={{ fontWeight: 500, color: '#2C3D66', marginBottom: 8, fontSize: isMobile ? 14 : undefined }}>Comentarios</div>
                    <div style={{ marginBottom: 12 }}>
                      {(comments[ticket.id] || []).map((c) => (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                          <div style={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, borderRadius: isMobile ? 14 : 16, background: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: isMobile ? 14 : 16 }}>
                            <UserOutlined />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: '#2C3D66', fontSize: isMobile ? 13 : 14 }}>Usuario</div>
                            <div style={{ color: '#64748B', fontSize: isMobile ? 13 : 14 }}>{c.comment}</div>
                            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Input
                        placeholder="Agregar comentario..."
                        style={{ flex: 1, borderRadius: 8 }}
                        value={commentInputs[ticket.id] || ''}
                        onChange={e => setCommentInputs((prev) => ({ ...prev, [ticket.id]: e.target.value }))}
                        onPressEnter={() => handleAddComment(ticket.id)}
                        disabled={commentLoading[ticket.id]}
                      />
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        style={{ borderRadius: 8, background: '#568E2B', border: 'none' }}
                        loading={commentLoading[ticket.id]}
                        onClick={() => handleAddComment(ticket.id)}
                      />
                    </div>
                  </div>
                )}
                {/* Botón eliminar en tickets cerrados */}
                {activeTab === 'cerrados' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <Button 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => setDeleteModalOpen({ open: true, ticketId: ticket.id })}
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
        {/* Modal de confirmación de eliminación */}
        <Modal
          open={deleteModalOpen.open}
          onOk={() => deleteModalOpen.ticketId && handleDelete(deleteModalOpen.ticketId)}
          onCancel={() => setDeleteModalOpen({ open: false })}
          okText="Eliminar"
          cancelText="Cancelar"
        >
          ¿Estás seguro que deseas eliminar este ticket?
        </Modal>

        {/* Modal de confirmación de creación */}
        <Modal
          open={createModalOpen}
          title="Confirmar Creación de Ticket"
          onOk={handleConfirmCreate}
          onCancel={() => setCreateModalOpen(false)}
          okText="Confirmar"
          cancelText="Cancelar"
        >
          ¿Estás seguro que deseas crear este ticket?
        </Modal>
        

      </Col>
    </Row>
  );
};

export default SupportPage; 