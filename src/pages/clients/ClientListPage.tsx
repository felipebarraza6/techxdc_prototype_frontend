import React, { useEffect, useState } from 'react';
import { Button, Spin, Alert, Row, Col, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';
import { clientService } from '../../api/clientService';
import type { Client } from '../../types/client';
import ClientCard from '../../components/clients/ClientCard';
import { useApiResource } from '../../hooks/useApiResource';
import { useHeaderActions } from '../../context/HeaderActionsContext';
import { clientsMock } from '../../mocks/clientsMock';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { SelectedClientProvider, useSelectedClient } from '../../context/SelectedClientContext';

const ClientListContent: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);
  const { setHeaderActions } = useHeaderActions();
  const breakpoint = useBreakpoint();
  const { selectedClient, setSelectedClient } = useSelectedClient();

  const {
    data: clients,
    loading,
    error,
    fetchAll,
  } = useApiResource<Client, Omit<Client, 'id' | 'created_at' | 'updated_at'>>(clientService);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const actions = (
      <div
        style={{
          display: 'flex',
          flexDirection: breakpoint.isMobile ? 'column' : 'row',
          gap: 16,
          width: breakpoint.isMobile ? '100%' : 'auto',
          minWidth: 0,
          marginTop: breakpoint.isMobile ? 16 : 0,
        }}
      >
        <Input
          className="cliente-busqueda-input"
          placeholder="Buscar Cliente"
          suffix={<SearchOutlined style={{ color: '#fff' }} />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: '#425176',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            width: breakpoint.isMobile ? '100%' : 250,
            minWidth: 0,
            height: breakpoint.isMobile ? 30 : undefined,
            fontSize: breakpoint.isMobile ? 13 : undefined,
            padding: breakpoint.isMobile ? '0 8px' : undefined,
          }}
          allowClear
        />
        <Button
          className="cliente-crear-btn"
          type="primary"
          style={{
            background: '#568E2B',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            width: breakpoint.isMobile ? '100%' : 250,
            minWidth: 0,
            height: breakpoint.isMobile ? 30 : undefined,
            fontSize: breakpoint.isMobile ? 13 : undefined,
            padding: breakpoint.isMobile ? '0 8px' : undefined,
          }}
          onClick={() => navigate('/clients/create')}
        >
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ flex: 1, textAlign: 'left' }}>Crear Cliente</span>
            <PlusOutlined style={{ marginLeft: 8 }} />
          </span>
        </Button>
      </div>
    );
    setHeaderActions(actions);
    return () => setHeaderActions(null);
  }, [search, navigate, setHeaderActions, breakpoint.isMobile]);

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const displayClients = (clients.length === 0 ? clientsMock : filteredClients);
  const visibleClients = displayClients.slice(0, visibleCount);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* Grid de cards */}
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <Row gutter={[16, 24]}>
          {visibleClients.map(client => (
            <Col key={client.id} xs={24} sm={12} md={12} lg={8} xl={8} style={{ display: 'flex', justifyContent: 'center' }}>
              <ClientCard
                client={client}
                selected={selectedClient?.id === client.id}
                onClick={() => setSelectedClient(client)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Botón Ver más / Ver menos */}
      {visibleCount < displayClients.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Button
            onClick={() => setVisibleCount(c => c + 9)}
            style={{ borderRadius: 8, fontWeight: 600, background: '#568E2B', color: '#fff', minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            icon={<DownOutlined />}
          >
            Ver Más
          </Button>
        </div>
      )}
      {visibleCount > 9 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Button
            onClick={() => setVisibleCount(9)}
            style={{ borderRadius: 8, fontWeight: 600, background: '#1C355F', color: '#fff', minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            icon={<DownOutlined rotate={180} />}
          >
            Ver Menos
          </Button>
        </div>
      )}
    </div>
  );
};

const ClientListPage: React.FC = () => (
  <SelectedClientProvider>
    <ClientListContent />
  </SelectedClientProvider>
);

export default ClientListPage;