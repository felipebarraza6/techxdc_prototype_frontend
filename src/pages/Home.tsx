import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Switch, DatePicker, Button, Space } from 'antd';
import {
  ClockCircleTwoTone,
  DashboardTwoTone,
  DatabaseTwoTone,
  FundTwoTone,
  AlertOutlined
} from '@ant-design/icons';
import WellVisualization from '../components/well/WellVisualization';
import { fetchWellData } from '../api/wellService';
import type { WellData, MetricCardProps } from '../types/well';
import { useSelectedClient, SelectedClientProvider } from '../context/SelectedClientContext';

const { Title, Text } = Typography;

const cardTextColor = { color: '#1C355F' };

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, unit, timestamp, style }) => (
  <Card bordered style={{ height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...cardTextColor, ...style }}>
    <Space align="center" style={{ marginBottom: 8, ...cardTextColor }}>
      {icon}
      <Text style={{ fontWeight: 500, ...cardTextColor }}>{title}</Text>
    </Space>
    <div style={{ fontSize: 28, fontWeight: 500, marginBottom: 4, ...cardTextColor }}>
      {value} <span style={{ fontSize: 16 }}>{unit}</span>
    </div>
    {timestamp && <Text type="secondary" style={{ fontSize: 13, ...cardTextColor }}>{timestamp}</Text>}
  </Card>
);

const dashboardData = {
  lastConnection: {
    icon: <ClockCircleTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />, title: 'Última conexión logger', value: '0', unit: 'm³', timestamp: '20:00 hrs'
  },
  lastMeasurement: {
    icon: <ClockCircleTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />, title: 'Última medición guardada', value: '0', unit: 'm³', timestamp: '20:00 hrs'
  },
  accumulatedSummary: {
    icon: <ClockCircleTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />, title: 'Resumen acumulado', value: '0', unit: 'm³', timestamp: '20:00 hrs'
  },
  currentMeasurement: {
    icon: <ClockCircleTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />, title: 'Última Medición', value: '0', unit: 'm³', timestamp: '20:00 hrs'
  },
  currentFlow: {
    icon: <DashboardTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />, title: 'Caudal actual', value: '0.00', unit: 'L/s', timestamp: ''
  },
  waterLevel: {
    icon: <FundTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />, title: 'Nivel freático', value: '18.70', unit: 'metros', timestamp: ''
  },
  accumulated: {
    icon: <DatabaseTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />, title: 'Acumulado', value: '338.198', unit: 'm³', timestamp: ''
  }
};

const Home = () => {
  const [serviceStatus, setServiceStatus] = useState(true);
  const [meeExtraction, setMeeExtraction] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [wellData, setWellData] = useState<WellData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { selectedClient } = useSelectedClient();


  useEffect(() => {
    setLoading(true);
    fetchWellData()
      .then(data => {
        setWellData(data);
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-alert-btn:hover, .custom-alert-btn:focus {
        border-color: #1C355F !important;
        color: #1C355F !important;
        background: #fff !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 16, color: '#1C355F', width: '100%' }}>
      <Title level={2} style={{ color: '#1C355F', marginBottom: 32 }}>
        Bienvenido, {selectedClient ? selectedClient.name : (loading ? '--' : error ? '--' : wellData && wellData.clientName ? wellData.clientName : '--')}
      </Title>
      {/* Panel de controles */}
      <Row gutter={[8, 8]} align="middle" style={{ marginBottom: 24, width: '100%' }}>
        <Col xs={12} sm={12} md={12} lg={6} xl={6} style={{ display: 'flex', justifyContent: 'center' }}>
          <Card bordered bodyStyle={{ padding: '1px 8px', height: 36, display: 'flex', alignItems: 'center' }} style={{ width: '100%', minWidth: 120, maxWidth: 224, height: 36, borderRadius: 8, borderWidth: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', height: 36, gap: 8, justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 500, flex: 1, color: '#1C355F', fontSize: 14 }}>Estado servicio</Text>
              <div style={{ flex: 'none' }}>
                <Switch checked={serviceStatus} onChange={setServiceStatus} size="small" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6} xl={6} style={{ display: 'flex', justifyContent: 'center' }}>
          <Card bordered bodyStyle={{ padding: '1px 8px', height: 36, display: 'flex', alignItems: 'center' }} style={{ width: '100%', minWidth: 120, maxWidth: 224, height: 36, borderRadius: 8, borderWidth: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', height: 36, gap: 8, justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 500, flex: 1, color: '#1C355F', fontSize: 14 }}>Extracción MEE</Text>
              <div style={{ flex: 'none' }}>
                <Switch checked={meeExtraction} onChange={setMeeExtraction} size="small" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6} xl={6} style={{ marginTop: 8 }}>
          <DatePicker value={selectedDate} onChange={setSelectedDate} style={{ width: '100%', height: 40 }} placeholder="Seleccionar fecha" />
        </Col>
        <Col xs={12} sm={12} md={12} lg={6} xl={6} style={{ marginTop: 8 }}>
          <Button
            type="default"
            style={{
              width: '100%',
              height: 40,
              borderColor: '#D1D5DB',
              color: '#1C355F',
              fontWeight: 500,
              background: '#fff',
              transition: 'border-color 0.2s, color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            className="custom-alert-btn"
          >
            <span style={{ flex: 1, textAlign: 'left' }}>Crear alerta</span>
            <AlertOutlined style={{ fontSize: 22, color: '#1C355F', marginLeft: 8 }} />
          </Button>
        </Col>
      </Row>
      {/* Métricas superiores */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24, width: '100%' }}>
        <Col xs={12} sm={12} md={12} lg={8} xl={8}><MetricCard {...dashboardData.lastConnection} value={loading || error ? '--' : dashboardData.lastConnection.value} /></Col>
        <Col xs={12} sm={12} md={12} lg={8} xl={8}><MetricCard {...dashboardData.lastMeasurement} value={loading || error ? '--' : dashboardData.lastMeasurement.value} /></Col>
        <Col xs={12} sm={12} md={24} lg={8} xl={8}><MetricCard {...dashboardData.accumulatedSummary} value={loading || error ? '--' : dashboardData.accumulatedSummary.value} /></Col>
      </Row>
      {/* Métricas e imagen */}
      <Row gutter={[12, 12]} style={{ width: '100%' }}>
        {/* En escritorio: cards a la izquierda, pozo a la derecha. En móvil/tablet: todo apilado */}
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Row gutter={[12, 12]}>
            <Col xs={12} sm={12} md={12} lg={24} xl={24}>
              <MetricCard
                icon={<DashboardTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />}
                title="Caudal actual"
                value={loading || error ? '--' : wellData ? wellData.flowRate.toFixed(2) : '--'}
                unit="L/s"
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={24} xl={24}>
              <MetricCard
                icon={<FundTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />}
                title="Nivel freático"
                value={loading || error ? '--' : wellData ? wellData.depth.toFixed(2) : '--'}
                unit="metros"
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={24} xl={24}>
              <MetricCard
                icon={<DatabaseTwoTone twoToneColor="#1677ff" style={{ fontSize: 22 }} />}
                title="Acumulado"
                value={loading || error ? '--' : wellData ? wellData.volume.toFixed(3) : '--'}
                unit="m³"
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card bordered style={{ borderRadius: 16, minHeight: 480, display: 'flex', flexDirection: 'column', padding: 20 }}>
            <div style={{ marginBottom: 4 }}>
              <Title level={4} style={{ color: '#1C355F', margin: 0, textAlign: 'left', fontSize: 20, lineHeight: 1.4 }}>Visualización del Pozo</Title>
              <Text type="secondary" style={{ color: '#1C355F', display: 'block', textAlign: 'left', fontSize: 14, lineHeight: 1.2, margin: 0 }}>Representación en tiempo real del estado del pozo</Text>
            </div>
            <div style={{ flex: 2, width: '100%', height: '100%', display: 'contents', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <WellVisualization pozoScale={1.5} wellData={wellData} loading={loading} error={error} pozoBoxStyle={{ position: 'relative', top: -100, left: -70 }} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const HomeWithProvider = () => (
  <SelectedClientProvider>
    <Home />
  </SelectedClientProvider>
);

export default HomeWithProvider;