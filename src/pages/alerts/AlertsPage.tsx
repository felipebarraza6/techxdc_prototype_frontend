import React, { useState } from 'react';
import { Row, Col, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import AlertList from '../../components/alerts/AlertList';
import AlertDetail from '../../components/alerts/AlertDetail';

const dummyAlerts = [
  {
    key: '1',
    code: 'TK-003',
    status: 'En desarrollo',
    priority: 'Alta',
    title: 'Error en lectura de sensor P2',
    description: 'El sensor del pozo P2 no está enviando datos desde ayer por la tarde',
    created: '2025-06-14',
    updated: '2025-06-15',
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
  },
];

const AlertsPage: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const navigate = useNavigate();

  return (
    <Row gutter={0} style={{ minHeight: '80vh', background: '#f4f6fa' }}>
      {/* Panel izquierdo: Preview o mensaje vacío */}
      <Col span={8} style={{ background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '32px 0' }}>
        <Button type="primary" style={{ background: '#568E2B', border: 'none', width: 180, height: 40, marginBottom: 32 }} onClick={() => navigate('/alerts/create')}>
          Crear nueva alerta
        </Button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {selectedAlert ? (
            <AlertDetail alert={selectedAlert} />
          ) : (
            <Card style={{ border: 'none', boxShadow: 'none', background: 'transparent', textAlign: 'center' }}>
              <div style={{ fontSize: 48, color: '#b0b8c9', marginBottom: 16 }}>
                <span role="img" aria-label="document">📄</span>
              </div>
              <div style={{ color: '#64748B', fontSize: 16 }}>
                Seleccione un documento para previsualizar
              </div>
            </Card>
          )}
        </div>
      </Col>
      {/* Panel derecho: Listado de alertas */}
      <Col span={16} style={{ padding: '32px 24px 0 24px' }}>
        {/* Header global lo maneja AppLayout */}
        <AlertList alerts={dummyAlerts} onSelect={setSelectedAlert} selectedKey={selectedAlert?.key} />
      </Col>
    </Row>
  );
};

export default AlertsPage; 