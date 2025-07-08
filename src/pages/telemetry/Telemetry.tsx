import  { useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Spin, Alert } from 'antd';
import WellVisualization from '../../components/well/WellVisualization';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const { Title, Text } = Typography;

const Telemetry = () => {
  const { selectedCatchmentPoint } = useSelectedCatchmentPoint();
  const { interactions, loading, error, getInteractionsByCatchmentPoint } = useInteractionDetails();
  const {  isMobile } = useBreakpoint();

  useEffect(() => {
    if (selectedCatchmentPoint) {
      getInteractionsByCatchmentPoint(selectedCatchmentPoint.id);
    }
  }, [selectedCatchmentPoint, getInteractionsByCatchmentPoint]);

  if (!selectedCatchmentPoint) {
    return <Alert message="Selecciona un pozo para ver la telemetría." type="info" showIcon />;
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  }

  if (error) {
    return <Alert message="Error al cargar datos de telemetría" description={error.toString()} type="error" showIcon />;
  }

  // El último registro de medición (puede ser null)
  const last = interactions.length > 0 ? interactions[0] : null;

  return (
    <div style={{ minHeight: '100vh', padding: 24, color: '#1C355F', width: '100%' }}>
      <Row gutter={[16, 16]}>
        {/* Columna izquierda: Métricas */}
        <Col xs={24} md={5}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card bordered style={{ height: 120 }}>
              <Text strong>Última Medición</Text>
              <div style={{ fontSize: 24 }}>{last ? last.total : '--'} m³</div>
              <Text type="secondary" style={{ fontSize: 12 }}>{last ? last.date_time_medition : '--'}</Text>
            </Card>
            <Card bordered style={{ height: 120 }}>
              <Text strong>Caudal actual</Text>
              <div style={{ fontSize: 24 }}>{last ? last.flow : '--'} L/s</div>
            </Card>
            <Card bordered style={{ height: 120 }}>
              <Text strong>Nivel freático</Text>
              <div style={{ fontSize: 24 }}>{last ? last.nivel : '--'} metros</div>
            </Card>
            <Card bordered style={{ height: 120 }}>
              <Text strong>Acumulado</Text>
              <div style={{ fontSize: 24 }}>{last ? last.total : '--'} m³</div>
            </Card>
            <Card bordered style={{ height: 120 }}>
              <Text strong>Total mensual</Text>
              <div style={{ fontSize: 24 }}>
                {/* Aquí podrías calcular la suma de total_diff del mes actual si lo necesitas */}
                -- m³
              </div>
            </Card>
          </Space>
        </Col>
        {/* Columna central: Visualización del Pozo */}
        <Col xs={24} md={12}>
          <Card bordered style={{ borderRadius: 16, minHeight: 480, display: 'flex', flexDirection: 'column', padding: 20 }}>
            <div style={{ marginBottom: 4 }}>
              <Title level={4} style={{ color: '#1C355F', margin: 0, textAlign: 'left', fontSize: 20, lineHeight: 1.4 }}>Visualización del Pozo</Title>
              <Text type="secondary" style={{ color: '#1C355F', display: 'block', textAlign: 'left', fontSize: 14, lineHeight: 1.2, margin: 0 }}>Representación en tiempo real del estado del pozo</Text>
            </div>
            <div style={{ flex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <WellVisualization
                pozoScale={isMobile ? 0.8 : 1.3}
                pozoBoxStyle={
                  isMobile
                    ? { position: 'relative', top: -40, left: -15 }
                    : { position: 'relative', top: -83, left: 0 }
                }
              />
            </div>
          </Card>
        </Col>
        {/* Columna derecha: Detalles técnicos, historial y franja azul */}
        <Col xs={24} md={7}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {/* Detalles técnicos */}
            <Card bordered style={{ borderRadius: 12, padding: 0 }}>
              <div style={{ padding: '16px 20px 12px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: '#1C355F', fontWeight: 600, fontSize: 16 }}>Detalles Técnicos:</span>
                  <span style={{ color: '#4CAF50', fontWeight: 700, marginLeft: 6 }}>{selectedCatchmentPoint ? `P${selectedCatchmentPoint.id}` : 'PZ'}</span>
                </div>
                {/* Aquí puedes agregar más detalles técnicos del pozo usando selectedCatchmentPoint */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748B' }}>Código</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>{selectedCatchmentPoint.code || '--'}</span>
                </div>
              </div>
            </Card>
            {/* Historial reciente */}
            <Card bordered style={{ borderRadius: 12, padding: 0 }}>
              <div style={{ padding: '16px 20px 12px 20px' }}>
                <div style={{ color: '#1E293B', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Historial reciente</div>
                {interactions.slice(0, 5).map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                    <div>
                      <span style={{ color: '#1E293B', fontWeight: 700, fontSize: 17 }}>{item.total}</span>
                      <span style={{ color: '#64748B', fontWeight: 500, fontSize: 15, marginLeft: 4 }}>m³</span>
                      <div style={{ color: '#64748B', fontSize: 14, fontWeight: 500 }}>{item.date_time_medition}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            {/* Código pozo y tipo */}
            <Card bordered={false} style={{ borderRadius: 12, padding: 0, background: 'transparent', boxShadow: 'none' }} bodyStyle={{ padding: 0 }}>
              <div style={{ background: '#2C3D66', borderRadius: '12px 12px 0 0', padding: '18px 20px 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: 20, letterSpacing: 1 }}>{selectedCatchmentPoint.code || '--'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                  <span style={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>MAYOR</span>
                  <span style={{ background: '#3B5484', color: '#fff', borderRadius: 16, padding: '2px 16px', fontWeight: 600, fontSize: 15, display: 'inline-block' }}>SUBTERRÁNEO</span>
                </div>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Telemetry; 