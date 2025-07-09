import React, { useState } from 'react';
import { Input, Button, List, Card, Tag, Space } from 'antd';
import { FilterOutlined, FileTextOutlined } from '@ant-design/icons';

interface AlertListProps {
  alerts: any[];
  onSelect: (alert: any) => void;
  selectedKey?: string;
}

const AlertList: React.FC<AlertListProps> = ({ alerts, onSelect, selectedKey }) => {
  const [activeTab, setActiveTab] = useState<'abiertas' | 'cerradas'>('abiertas');

  // Dummy para cerradas
  const closedAlerts: any[] = [];

  return (
    <Card style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }} bodyStyle={{ padding: 0 }}>
      {/* Título arriba */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#2C3D66' }}>Alertas activas</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Input.Search placeholder="Buscar alerta" style={{ width: 200, marginRight: 12 }} />
          <Button icon={<FilterOutlined />} style={{ borderRadius: 8, borderColor: '#D1D5DB', background: '#fff' }}>Filtrar</Button>
        </div>
      </div>
      {/* Tabs y lista debajo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <span
          onClick={() => setActiveTab('abiertas')}
          style={{
            background: activeTab === 'abiertas' ? '#5B8DD9' : '#F4F8FE',
            color: activeTab === 'abiertas' ? '#fff' : '#5B8DD9',
            borderRadius: 8,
            padding: '6px 18px 6px 14px',
            fontWeight: 500,
            fontSize: 15,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            border: activeTab === 'abiertas' ? 'none' : '1px solid #E5ECF6',
            transition: 'all 0.2s',
          }}
        >
          <FileTextOutlined style={{ marginRight: 6, fontSize: 17 }} />
          Alertas abiertas
          <span style={{
            background: activeTab === 'abiertas' ? '#E5ECF6' : '#fff',
            color: '#5B8DD9',
            borderRadius: 16,
            fontWeight: 600,
            fontSize: 15,
            padding: '2px 14px',
            marginLeft: 10,
            display: 'inline-block',
          }}>{alerts.length}</span>
        </span>
        <span
          onClick={() => setActiveTab('cerradas')}
          style={{
            background: activeTab === 'cerradas' ? '#5B8DD9' : '#F4F8FE',
            color: activeTab === 'cerradas' ? '#fff' : '#5B8DD9',
            borderRadius: 8,
            padding: '6px 18px 6px 14px',
            fontWeight: 500,
            fontSize: 15,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            border: activeTab === 'cerradas' ? 'none' : '1px solid #E5ECF6',
            transition: 'all 0.2s',
          }}
        >
          <FileTextOutlined style={{ marginRight: 6, fontSize: 17 }} />
          Alertas cerradas
          <span style={{
            background: activeTab === 'cerradas' ? '#E5ECF6' : '#fff',
            color: '#5B8DD9',
            borderRadius: 16,
            fontWeight: 600,
            fontSize: 15,
            padding: '2px 14px',
            marginLeft: 10,
            display: 'inline-block',
          }}>{closedAlerts.length}</span>
        </span>
      </div>
      <List
        dataSource={activeTab === 'abiertas' ? alerts : closedAlerts}
        renderItem={item => (
          <Card
            style={{
              marginBottom: 16,
              borderRadius: 8,
              boxShadow: selectedKey === item.key ? '0 0 0 2px #3368AB' : undefined,
              border: selectedKey === item.key ? '2px solid #3368AB' : '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, border 0.2s',
            }}
            bodyStyle={{ padding: 16 }}
            onClick={() => onSelect(item)}
          >
            <Space size="small" style={{ marginBottom: 4 }}>
              <Tag bordered={false} color="#e5e7eb" style={{ color: '#3368AB', fontWeight: 500 }}>{item.code}</Tag>
              <Tag bordered={false} color="#e5e7eb" style={{ color: '#568E2B', fontWeight: 500 }}>{item.status}</Tag>
              <Tag bordered={false} color="#F87171" style={{ color: '#fff', fontWeight: 500 }}>{item.priority}</Tag>
            </Space>
            <div style={{ fontWeight: 600, color: '#2C3D66', fontSize: 16 }}>{item.title}</div>
            <div style={{ color: '#64748B', fontSize: 14, marginBottom: 8 }}>{item.description}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 12, color: '#94A3B8' }}>
              Creado: {item.created} &nbsp;|&nbsp; Actualizado: {item.updated}
            </div>
          </Card>
        )}
      />
    </Card>
  );
};

export default AlertList; 