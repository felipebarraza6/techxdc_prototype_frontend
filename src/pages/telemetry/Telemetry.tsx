import React from 'react';
import { Row, Col, Card, Typography, Space, Spin, Alert, Drawer, Button } from 'antd';
import WellVisualization from '../../components/well/WellVisualization';
import { ClockCircleTwoTone, DashboardTwoTone, DatabaseTwoTone, FundTwoTone, InfoCircleTwoTone, InfoCircleOutlined, FileTextOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import dgaLogo from '../../assets/img/dganuevo.jpg';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useDgaConfigCatchment } from '../../hooks/useDgaConfigCatchment';
import { useProfileConfigCatchment } from '../../hooks/useProfileConfigCatchment';
import type { MetricCardProps } from '../../types/telemetry';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { selectedCatchmentPoint } = useSelectedCatchmentPoint();
  const { interactions, loading, error, getInteractionsByCatchmentPoint } = useInteractionDetails();
  const { isMobile } = useBreakpoint();
  const { dgaConfigs, getAllDgaConfigs } = useDgaConfigCatchment();
  const { profileDataConfigs, getProfileDataConfigs } = useProfileConfigCatchment();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const pageSize = 5;
  const medicionesCount = interactions.length;

  React.useEffect(() => {
    getAllDgaConfigs();
    getProfileDataConfigs();
  }, []); // Solo una vez al montar

  React.useEffect(() => {
    if (selectedCatchmentPoint) {
      getInteractionsByCatchmentPoint(selectedCatchmentPoint.id);
    }
  }, [selectedCatchmentPoint, getInteractionsByCatchmentPoint]);

  // Resetear showAll al abrir drawer o cambiar de pozo
  React.useEffect(() => {
    setShowAll(false);
  }, [drawerOpen, selectedCatchmentPoint]);

  const last = React.useMemo(() => interactions.length > 0 ? interactions[0] : null, [interactions]);
  const dgaConfig = React.useMemo(() => selectedCatchmentPoint ? dgaConfigs.find(cfg => cfg.point_catchment === selectedCatchmentPoint.id) : undefined, [dgaConfigs, selectedCatchmentPoint]);
  const profileConfig = React.useMemo(() => selectedCatchmentPoint ? profileDataConfigs.find(cfg => cfg.point_catchment === selectedCatchmentPoint.id) : undefined, [profileDataConfigs, selectedCatchmentPoint]);
  const now = React.useMemo(() => new Date(), []);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const totalMensual = React.useMemo(() => interactions
    .filter(item => {
      const date = new Date(item.date_time_medition);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + (typeof item.total_diff === 'number' ? item.total_diff : 0), 0), [interactions, currentMonth, currentYear]);

  if (!selectedCatchmentPoint) {
    return <Alert message="Selecciona un punto de captación para ver la telemetría." type="info" showIcon />;
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  }

  if (error) {
    return <Alert message="Error al cargar datos de telemetría" description={error.toString()} type="error" showIcon />;
  }

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
            <MetricCard icon={<InfoCircleTwoTone twoToneColor="#1677ff" style={{ fontSize: 20 }} />} title="Total mensual" value={totalMensual.toLocaleString('es-CL', { maximumFractionDigits: 2 })} unit="m³" />
          </Space>
        </Col>
        {/* Columna central: Visualización del Pozo */}
        <Col xs={24} md={12}>
          <Card bordered style={{ borderRadius: 16, minHeight: 480, display: 'flex', flexDirection: 'column', padding: 20 }}>
            <div style={{ marginBottom: 4 }}>
              <Title level={4} style={{ color: '#1C355F', margin: 0, textAlign: 'left', fontSize: 20, lineHeight: 1.4 }}>Visualización del Punto de captación</Title>
              <Text type="secondary" style={{ color: '#1C355F', display: 'block', textAlign: 'left', fontSize: 14, lineHeight: 1.2, marginTop: 5 }}>Representación en tiempo real del estado del punto de captación</Text>
            </div>
            <div style={{ flex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <WellVisualization
                pozoScale={isMobile ? 0.8 : 1.25}
                pozoBoxStyle={
                  isMobile
                    ? { position: 'relative', top: -40, left: -15 }
                    : { position: 'relative', top: -70, left: -30 }
                }
                wellData={last ? {
                  depth: last.nivel ? Number(last.nivel) : undefined,
                  flowRate: last.flow ? Number(last.flow) : undefined,
                  volume: last.total ? Number(last.total) : undefined
                } : undefined}
                loading={loading}
                error={!!error}
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
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>{profileConfig?.d2 ? `${profileConfig.d2} m` : '-- m'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748B' }}>Sensor Nivel</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>{profileConfig?.d3 ? `${profileConfig.d3} m` : '-- m'}</span>
                </div>
                <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                <div style={{ color: '#1E293B', fontWeight: 500, marginBottom: 4 }}>Diámetros</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ color: '#64748B' }}>Ducto salida bomba</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>{profileConfig?.d4 ? `${profileConfig.d4} pulg` : '-- pulg'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748B' }}>Flujómetro</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>{profileConfig?.d5 ? `${profileConfig.d5} pulg` : '-- pulg'}</span>
                </div>
                <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                <div style={{ color: '#1E293B', fontWeight: 500, marginBottom: 4 }}>Caudalímetro</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ color: '#64748B' }}>Puesto en marcha</span>
                  <span style={{ fontWeight: 600, color: '#1C355F' }}>{profileConfig?.date_start_telemetry || '--'}</span>
                </div>
              </div>
            </Card>
            {/* Botón Mediciones */}
            <Button
              type="primary"
              style={{ width: '100%', background: '#2C3D66', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', margin: '12px 0 0 0', borderRadius: 8 }}
              onClick={() => setDrawerOpen(true)}
            >
              Mediciones ({medicionesCount})
            </Button>
            {/* Historial reciente (eliminado, ahora en el drawer) */}
            {/* Franja azul con icono y franja blanca con logo DGA */}
            <Card bordered={false} style={{ borderRadius: 12, padding: 0, background: 'transparent', boxShadow: 'none' }} bodyStyle={{ padding: 0 }}>
              <div style={{ background: '#2C3D66', borderRadius: '12px 12px 0 0', padding: '18px 20px 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 0, width: '100%', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>{dgaConfig?.standard || 'MAYOR'}</span>
                  <span style={{ background: '#3B5484', color: '#fff', borderRadius: 16, padding: '2px 16px', fontWeight: 600, fontSize: 15, display: 'inline-block' }}>{dgaConfig?.type_dga || 'SUBTERRÁNEO'}</span>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: '0 0 12px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0 24px 0' }}>
                <img src={dgaLogo} alt="Logo DGA" style={{ height: 70, width: 'auto', margin: '0 auto', display: 'block' }} />
              </div>
            </Card>
            {/* Drawer de Mediciones */}
            <Drawer
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#2C3D66', padding: '12px 20px', borderRadius: '12px 12px 0 0', color: '#fff' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileTextOutlined style={{ color: '#fff', fontSize: 18 }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>{dgaConfig?.code_dga || '--'}</span>
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 18 }}>Mediciones ({medicionesCount})</span>
                </div>
              }
              placement="right"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              width={420}
              bodyStyle={{ padding: 0, background: '#f4f6fa' }}
              headerStyle={{ padding: 0, background: 'transparent', borderBottom: 'none' }}
            >
              <div style={{ padding: '24px 24px 0 24px' }}>
                {medicionesCount === 0 ? (
                  <div style={{ color: '#64748B', textAlign: 'center', marginTop: 32 }}>No hay mediciones registradas.</div>
                ) : (
                  <>
                    <div style={{ minHeight: 320, transition: 'all 0.3s', position: 'relative' }}>
                      {/* Primeros 5 ítems siempre visibles (sin animación) */}
                      {interactions.slice(0, pageSize).map((item) => (
                        <React.Fragment key={item.id}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', gap: 24 }}>
                            <span style={{ color: '#1E293B', fontWeight: 700, fontSize: 20, minWidth: 90 }}>{item.total} m³</span>
                            <span style={{ color: '#64748B', fontWeight: 500, fontSize: 15, textAlign: 'right', flex: 1 }}>{item.date_time_medition}</span>
                          </div>
                          <div style={{ borderTop: '1px solid #E5E7EB', margin: '0 0 0 0', width: '100%' }} />
                        </React.Fragment>
                      ))}
                      
                      {/* Bloque animado solo para mediciones adicionales */}
                      <AnimatePresence initial={false} mode="wait">
                        {showAll && (
                          <motion.div
                            key="expanded"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            {interactions.slice(pageSize).map((item) => (
                              <React.Fragment key={item.id}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', gap: 24 }}>
                                  <span style={{ color: '#1E293B', fontWeight: 700, fontSize: 20, minWidth: 90 }}>{item.total} m³</span>
                                  <span style={{ color: '#64748B', fontWeight: 500, fontSize: 15, textAlign: 'right', flex: 1 }}>{item.date_time_medition}</span>
                                </div>
                                <div style={{ borderTop: '1px solid #E5E7EB', margin: '0 0 0 0', width: '100%' }} />
                              </React.Fragment>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {interactions.length > pageSize && (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '18px 0 8px 0' }}>
                        <span
                          style={{ color: '#1677ff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          onClick={() => setShowAll((prev) => !prev)}
                        >
                          {showAll ? (
                            <>
                              Ver menos <UpOutlined />
                            </>
                          ) : (
                            <>
                              Ver más <DownOutlined />
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Drawer>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Telemetry; 