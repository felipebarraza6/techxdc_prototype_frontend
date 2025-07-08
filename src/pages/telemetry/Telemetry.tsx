import React from 'react';
import { Row, Col, Card, Typography, Space, Spin, Alert } from 'antd';
import WellVisualization from '../../components/well/WellVisualization';
import { ClockCircleTwoTone, DashboardTwoTone, DatabaseTwoTone, FundTwoTone, InfoCircleTwoTone, InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import dgaLogo from '../../assets/img/dganuevo.jpg';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useDgaConfigCatchment } from '../../hooks/useDgaConfigCatchment';
import { useProfileConfigCatchment } from '../../hooks/useProfileConfigCatchment';
import type { MetricCardProps } from '../../types/telemetry';

const { Title, Text } = Typography;

// Componente reutilizable para métricas
const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, unit, timestamp, style }) => (
  <Card bordered style={{ height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#1C355F', borderRadius: 12, ...style }}>
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
  const { selectedCatchmentPoint, catchmentPoints } = useSelectedCatchmentPoint();
  const { interactions, loading, error, getInteractionsByCatchmentPoint } = useInteractionDetails();
  const { isMobile } = useBreakpoint();
  const { dgaConfigs, getAllDgaConfigs } = useDgaConfigCatchment();
  const { profileDataConfigs, getProfileDataConfigs } = useProfileConfigCatchment();

  React.useEffect(() => {
    getAllDgaConfigs();
    getProfileDataConfigs();
  }, []); // Solo una vez al montar

  React.useEffect(() => {
    if (selectedCatchmentPoint) {
      getInteractionsByCatchmentPoint(selectedCatchmentPoint.id);
    }
  }, [selectedCatchmentPoint, getInteractionsByCatchmentPoint]);

  // LOGS comparativos para depuración de IDs
  console.log('IDs en selector:', catchmentPoints.map(cp => cp.id));
  console.log('point_catchment en dgaConfigs:', dgaConfigs.map(cfg => cfg.point_catchment));
  console.log('point_catchment en profileDataConfigs:', profileDataConfigs.map(cfg => cfg.point_catchment));
  console.log('selectedCatchmentPoint:', selectedCatchmentPoint?.id);

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
  // Buscar la config DGA correspondiente al pozo seleccionado
  const dgaConfig = dgaConfigs.find(cfg => cfg.point_catchment === selectedCatchmentPoint.id);
  // Buscar la config de perfil correspondiente al pozo seleccionado
  const profileConfig = profileDataConfigs.find(cfg => cfg.point_catchment === selectedCatchmentPoint.id);

  return (
    <div style={{ minHeight: '100vh', padding: 24, color: '#1C355F', width: '100%' }}>
      <Row gutter={[16, 16]}>
        {/* Columna izquierda: Métricas */}
        <Col xs={24} md={5}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <MetricCard icon={<ClockCircleTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Última Medición" value={last ? last.total : '--'} unit="m³" timestamp={last ? last.date_time_medition : undefined} />
            <MetricCard icon={<DashboardTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Caudal actual" value={last ? last.flow : '--'} unit="L/s" />
            <MetricCard icon={<FundTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Nivel freático" value={last ? last.nivel : '--'} unit="metros" />
            <MetricCard icon={<DatabaseTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Acumulado" value={last ? last.total : '--'} unit="m³" />
            <MetricCard icon={<InfoCircleTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Total mensual" value="--" unit="m³" />
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
                pozoScale={isMobile ? 0.8 : 1.34}
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
                  <InfoCircleOutlined style={{ fontSize: 16, color: '#1C355F', marginRight: 8 }} />
                  <span style={{ color: '#1C355F', fontWeight: 600, fontSize: 16 }}>Detalles Técnicos:</span>
                  <span style={{ color: '#4CAF50', fontWeight: 700, marginLeft: 6 }}>{selectedCatchmentPoint ? `P${selectedCatchmentPoint.id}` : 'PZ'}</span>
                </div>
                {/* Aquí puedes agregar más detalles técnicos del pozo usando selectedCatchmentPoint */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748B' }}>Código</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>{dgaConfig?.code_dga || '--'}</span>
                </div>
                <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                <div style={{ color: '#1E293B', fontWeight: 500, marginBottom: 4 }}>Posicionamientos</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ color: '#64748B' }}>Bomba</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>-- <span style={{ color: '#9CA3AF', fontWeight: 400 }}>m</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748B' }}>Sensor Nivel</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>-- <span style={{ color: '#9CA3AF', fontWeight: 400 }}>m</span></span>
                </div>
                <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                <div style={{ color: '#1E293B', fontWeight: 500, marginBottom: 4 }}>Diámetros</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ color: '#64748B' }}>Ducto salida bomba</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>-- <span style={{ color: '#9CA3AF', fontWeight: 400 }}>pulg</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748B' }}>Flujómetro</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>-- <span style={{ color: '#9CA3AF', fontWeight: 400 }}>pulg</span></span>
                </div>
                <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                <div style={{ color: '#1E293B', fontWeight: 500, marginBottom: 4 }}>Caudalímetro</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ color: '#64748B' }}>Puesto en marcha</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>{profileConfig?.date_start_telemetry ? profileConfig.date_start_telemetry : '--'}</span>
                </div>
              </div>
            </Card>
            {/* Historial reciente */}
            <Card bordered style={{ borderRadius: 12, padding: 0 }}>
              <div style={{ padding: '16px 20px 12px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, width: '100%', paddingRight: 2 }}>
                  <span style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <InfoCircleOutlined style={{ color: '#1E293B', fontSize: 16, flexShrink: 0 }} />
                    <span style={{ color: '#1E293B', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', marginLeft: 7, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                      Historial reciente
                    </span>
                  </span>
                </div>
                {/* Lista de mediciones real, pero sin datos dummy ni botón de mediciones */}
                {interactions.slice(0, 5).map((item) => (
                  <React.Fragment key={item.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                      <div>
                        <span style={{ color: '#1E293B', fontWeight: 700, fontSize: 17 }}>{item.total}</span>
                        <span style={{ color: '#64748B', fontWeight: 500, fontSize: 15, marginLeft: 4 }}>m³</span>
                        <div style={{ color: '#64748B', fontSize: 14, fontWeight: 500 }}>{item.date_time_medition}</div>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #E5E7EB', margin: '0 0 0 0', width: '100%' }} />
                  </React.Fragment>
                ))}
              </div>
            </Card>
            {/* Franja azul con icono y franja blanca con logo DGA */}
            <Card bordered={false} style={{ borderRadius: 12, padding: 0, background: 'transparent', boxShadow: 'none' }} bodyStyle={{ padding: 0 }}>
              <div style={{ background: '#2C3D66', borderRadius: '12px 12px 0 0', padding: '18px 20px 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: 20, letterSpacing: 1 }}>{dgaConfig?.code_dga || '--'}</span>
                  <FileTextOutlined style={{ color: '#fff', fontSize: 18, marginLeft: 10 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                  <span style={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>{dgaConfig?.standard || 'MAYOR'}</span>
                  <span style={{ background: '#3B5484', color: '#fff', borderRadius: 16, padding: '2px 16px', fontWeight: 600, fontSize: 15, display: 'inline-block' }}>{dgaConfig?.type_dga || 'SUBTERRÁNEO'}</span>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: '0 0 12px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0 24px 0' }}>
                <img src={dgaLogo} alt="Logo DGA" style={{ height: 70, width: 'auto', margin: '0 auto', display: 'block' }} />
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Telemetry; 