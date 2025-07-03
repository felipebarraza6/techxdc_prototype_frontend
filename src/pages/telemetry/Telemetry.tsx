import React from 'react';
import { Row, Col, Card, Typography, Space, Progress } from 'antd';
import WellVisualization from '../../components/well/WellVisualization';
import { ClockCircleTwoTone, DashboardTwoTone, DatabaseTwoTone, FundTwoTone, InfoCircleTwoTone, HistoryOutlined } from '@ant-design/icons';
import dgaLogo from '../../assets/img/dganuevo.jpg';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const { Title, Text } = Typography;

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  timestamp?: string;
}

// Componente reutilizable para métricas
const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, unit, timestamp }) => (
  <Card bordered style={{ height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#1C355F', borderRadius: 12 }}>
    <Space align="center" style={{ marginBottom: 8, color: '#1C355F' }}>
      {icon}
      <Text style={{ fontWeight: 500, color: '#1C355F' }}>{title}</Text>
    </Space>
    <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 4, color: '#1C355F' }}>
      {value} <span style={{ fontSize: 14 }}>{unit}</span>
    </div>
    {timestamp && <Text type="secondary" style={{ fontSize: 12, color: '#1C355F' }}>{timestamp}</Text>}
  </Card>
);

const Telemetry = () => {
  const { pozoScale } = useBreakpoint();

  return (
    <div style={{ background: '#F7FAFC', minHeight: '100vh', padding: 24, color: '#1C355F', width: '100%' }}>
      <Row gutter={[16, 16]}>
        {/* Columna izquierda: Métricas */}
        <Col xs={24} md={5}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <MetricCard icon={<ClockCircleTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Última Medición" value="0" unit="m³" timestamp="20:03 hrs" />
            <MetricCard icon={<DashboardTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Caudal actual" value="0.00" unit="L/s" />
            <MetricCard icon={<FundTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Nivel freático" value="18.70" unit="metros" />
            <MetricCard icon={<DatabaseTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Acumulado" value="338.198" unit="m³" />
            <MetricCard icon={<InfoCircleTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Total mensual" value="472.50" unit="m³" />
          </Space>
        </Col>
        {/* Columna central: Visualización del Pozo */}
        <Col xs={24} md={14}>
          <Card bordered style={{ borderRadius: 16, minHeight: 410, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 520, minHeight: 370, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <WellVisualization pozoScale={1.18} pozoBoxStyle={{ position: 'relative', top: 0, width: '100%', height: 370, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }} />
            </div>
            {/* Frecuencia de medición */}
            <Card bordered style={{ borderRadius: 16, marginTop: 16, padding: 16 }}>
              <Text style={{ color: '#1C355F', fontWeight: 500 }}>Frecuencia de Medición</Text>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ color: '#1C355F', marginRight: 16 }}>60min</Text>
                <Progress percent={80} showInfo={false} strokeColor="#568E2B" style={{ flex: 1 }} />
                <Text style={{ color: '#1C355F', marginLeft: 16 }}>00:27:57</Text>
              </div>
            </Card>
          </Card>
        </Col>
        {/* Columna derecha: Detalles técnicos, historial y franja azul */}
        <Col xs={24} md={5}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {/* Detalles técnicos */}
            <Card bordered style={{ borderRadius: 12 }}>
              <Title level={5} style={{ color: '#1C355F', marginBottom: 8 }}>Detalles Técnicos: PZ</Title>
              <div style={{ color: '#1C355F', fontSize: 14 }}>
                <div>Profundidad: <b>81.0 m</b></div>
                <div>Posicionamientos:</div>
                <div style={{ marginLeft: 12 }}>Bomba: <b>60.0 m</b></div>
                <div style={{ marginLeft: 12 }}>Nivel estático: <b>19.5 m</b></div>
                <div>Diámetro ducto bomba: <b>6.00 pulg</b></div>
                <div>Caudalímetro: <b>0.00 m³/h</b></div>
                <div>Autorizado a marcha</div>
              </div>
            </Card>
            {/* Historial reciente */}
            <Card bordered style={{ borderRadius: 12 }}>
              <Space align="center" style={{ marginBottom: 8 }}>
                <HistoryOutlined style={{ color: '#1C355F', fontSize: 18 }} />
                <Text style={{ color: '#1C355F', fontWeight: 500 }}>Historial reciente <span style={{ color: '#1890FF', fontWeight: 400, fontSize: 13 }}>(mediciones 20h)</span></Text>
              </Space>
              <div style={{ color: '#1C355F', fontSize: 14 }}>
                <div>1061 pl</div>
                <div>1061 pl</div>
                <div>1046 pl</div>
              </div>
            </Card>
            {/* Franja azul con logo DGA */}
            <div style={{ background: '#1C355F', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <div>
                <Text style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>08-0902-77</Text>
                <div style={{ color: '#fff', fontSize: 13 }}>MAYOR <span style={{ background: '#568E2B', color: '#fff', borderRadius: 8, padding: '2px 8px', marginLeft: 8 }}>SUBTERRÁNEO</span></div>
              </div>
              <img src={dgaLogo} alt="Logo DGA" style={{ height: 48, marginLeft: 16 }} />
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Telemetry; 