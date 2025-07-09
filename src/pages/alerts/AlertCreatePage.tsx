import React from 'react';
import { Row, Col, Card, Input, Button, Typography, Space, Tag } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import AlertCreateForm from '../../components/alerts/AlertCreateForm';
import AlertComment from '../../components/alerts/AlertComment';
import { SendOutlined } from '@ant-design/icons';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const { Text } = Typography;

const dummyAlert = {
  key: '1',
  code: 'TK-003',
  status: 'En desarrollo',
  priority: 'Alta',
  title: 'Error en lectura de sensor P2',
  description: 'El sensor del pozo P2 no está enviando datos desde ayer por la tarde',
  created: '2025-06-14',
  updated: '2025-06-15',
};

const dummyComments = [
  {
    author: 'Usuario',
    date: '2025-06-14 14:30',
    text: 'El sensor del pozo P2 no está enviando datos desde ayer por la tarde',
    type: 'usuario' as 'usuario',
  },
  {
    author: 'Soporte técnico',
    date: '2025-06-14 14:40',
    text: 'Hemos identificado el problema. Estamos trabajando en la solución.',
    type: 'soporte' as 'soporte',
  },
];

const otherAlerts = [
  {
    key: '2',
    code: 'TK-004',
    status: 'Pendiente',
    priority: 'Media',
    title: 'Solicitud de nuevo reporte',
    description: 'Necesito un reporte personalizado para el análisis mensual',
    created: '2025-06-15',
    updated: '2025-06-15',
  },
];

const AlertCreatePage: React.FC = () => {
  const { isMobile } = useBreakpoint();

  return (
    <Row gutter={0} style={{ minHeight: '80vh', background: '#f4f6fa' }}>
      {/* Panel izquierdo: Formulario de creación */}
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
            Crear alerta
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
          <AlertCreateForm />
        </Card>
      </Col>
      {/* Panel derecho: Detalle, comentarios y otras alertas */}
      <Col 
        xs={24} 
        md={16} 
        style={{ 
          padding: isMobile ? '16px' : '32px 24px 0 24px',
          minHeight: isMobile ? 'auto' : '80vh'
        }}
      >
        {/* Tab visual de Alertas creadas */}
        <div style={{ marginBottom: 16 }}>
          <span style={{
            background: '#5B8DD9',
            color: '#fff',
            borderRadius: 8,
            padding: isMobile ? '4px 12px 4px 10px' : '6px 18px 6px 14px',
            fontWeight: 500,
            fontSize: isMobile ? 13 : 15,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <FileTextOutlined style={{ marginRight: 6, fontSize: isMobile ? 15 : 17 }} />
            Alertas creadas
            <span style={{
              background: '#E5ECF6',
              color: '#5B8DD9',
              borderRadius: 16,
              fontWeight: 600,
              fontSize: isMobile ? 13 : 15,
              padding: isMobile ? '1px 10px' : '2px 14px',
              marginLeft: 10,
              display: 'inline-block',
            }}>{1 + otherAlerts.length}</span>
          </span>
        </div>
        <Space direction="vertical" size={isMobile ? 12 : 16} style={{ width: '100%' }}>
          {/* Card principal: detalle y comentarios */}
          <Card style={{ 
            borderRadius: 10, 
            boxShadow: '0 2px 8px #0000000a', 
            border: '1px solid #e5e7eb' 
          }} bodyStyle={{ padding: isMobile ? 16 : 20 }}>
            {/* Chips y fechas */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              marginBottom: 4,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 8 : 0
            }}>
              <Space size="small" wrap>
                <Tag bordered={false} color="#e5e7eb" style={{ color: '#3368AB', fontWeight: 500 }}>{dummyAlert.code}</Tag>
                <Tag bordered={false} color="#e5e7eb" style={{ color: '#568E2B', fontWeight: 500 }}>{dummyAlert.status}</Tag>
                <Tag bordered={false} color="#F87171" style={{ color: '#fff', fontWeight: 500 }}>{dummyAlert.priority}</Tag>
              </Space>
              <div style={{ 
                fontSize: 12, 
                color: '#94A3B8', 
                textAlign: isMobile ? 'left' : 'right' 
              }}>
                Creado: {dummyAlert.created}<br />Actualizado: {dummyAlert.updated}
              </div>
            </div>
            {/* Título y descripción */}
            <div style={{ 
              fontWeight: 600, 
              color: '#2C3D66', 
              fontSize: isMobile ? 15 : 16 
            }}>{dummyAlert.title}</div>
            <div style={{ 
              color: '#64748B', 
              fontSize: isMobile ? 13 : 14, 
              marginBottom: 8 
            }}>{dummyAlert.description}</div>
            {/* Comentarios */}
            <div style={{ 
              marginTop: 12, 
              marginBottom: 8, 
              fontWeight: 500, 
              color: '#2C3D66',
              fontSize: isMobile ? 14 : undefined
            }}>Comentarios</div>
            <div style={{ marginBottom: 12 }}>
              {dummyComments.map((c, i) => (
                <AlertComment key={i} {...c} />
              ))}
            </div>
            {/* Input comentario */}
            <div style={{ display: 'flex', gap: 8 }}>
              <Input placeholder="Agregar comentario..." style={{ flex: 1, borderRadius: 8 }} />
              <Button type="primary" icon={<SendOutlined />} style={{ borderRadius: 8, background: '#568E2B', border: 'none' }} />
            </div>
          </Card>
          {/* Otras alertas creadas */}
          {otherAlerts.map(alert => (
            <Card key={alert.key} style={{ borderRadius: 10, border: '1px solid #e5e7eb' }} bodyStyle={{ padding: isMobile ? 12 : 16 }}>
              <Space size="small" style={{ marginBottom: 4 }} wrap>
                <Tag bordered={false} color="#e5e7eb" style={{ color: '#3368AB', fontWeight: 500 }}>{alert.code}</Tag>
                <Tag bordered={false} color="#e5e7eb" style={{ color: '#FBBF24', fontWeight: 500 }}>{alert.status}</Tag>
                <Tag bordered={false} color="#FBBF24" style={{ color: '#fff', fontWeight: 500 }}>{alert.priority}</Tag>
              </Space>
              <div style={{ 
                fontWeight: 600, 
                color: '#2C3D66', 
                fontSize: isMobile ? 14 : 15 
              }}>{alert.title}</div>
              <div style={{ 
                color: '#64748B', 
                fontSize: isMobile ? 13 : 14, 
                marginBottom: 8 
              }}>{alert.description}</div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                fontSize: 12, 
                color: '#94A3B8',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center'
              }}>
                Creado: {alert.created} {isMobile ? '' : '&nbsp;|&nbsp;'} Actualizado: {alert.updated}
              </div>
            </Card>
          ))}
        </Space>
      </Col>
    </Row>
  );
};

export default AlertCreatePage; 