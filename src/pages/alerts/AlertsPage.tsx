import React, { useState } from 'react';
import { Row, Col, Button, Card, Spin, Alert } from 'antd';
import AlertList from '../../components/alerts/AlertList';
import AlertDetail from '../../components/alerts/AlertDetail';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useTicketsWithStatus } from '../../hooks/useTicketsWithStatus';
import type { Ticket } from '../../hooks/useTicketsWithStatus';
import AlertCreateForm from '../../components/alerts/AlertCreateForm';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';

const AlertsPage: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { isMobile } = useBreakpoint();
  const { selectedCatchmentPoint } = useSelectedCatchmentPoint();
  const { tickets, loading, error } = useTicketsWithStatus();

  // --- PREPARACIÓN PARA FILTRADO POR CLIENTE EN EL FUTURO ---
  // TODO: Cuando el modelo de cliente esté disponible, usar el contexto real:
  // import { useSelectedClient } from 'src/context/SelectedClientContext';
  // const { selectedClient } = useSelectedClient();
  // Por ahora, null o dummy:
  const selectedClient = null;

  // Cuando esté disponible, filtrar así:
  const filteredTickets = selectedClient
    ? tickets.filter((ticket) => (ticket as any).client_id === (selectedClient as any).id)
    : tickets; // Por ahora, muestra todos

  const transformedAlerts = filteredTickets.map((ticket: Ticket) => ({
    key: ticket.id.toString(),
    code: `TK-${ticket.id.toString().padStart(3, '0')}`,
    status: ticket.status === 'closed' ? 'Cerrado' : 'En desarrollo',
    priority: ticket.priority || 'Media',
    title: ticket.title,
    description: ticket.description || 'Sin descripción',
    created: ticket.createdAt ? new Date(ticket.createdAt).toISOString().split('T')[0] : 'N/A',
    updated: ticket.updatedAt ? new Date(ticket.updatedAt).toISOString().split('T')[0] : 'N/A',
  }));

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        background: '#f4f6fa'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '32px',
        background: '#f4f6fa',
        minHeight: '80vh'
      }}>
        <Alert
          message="Error al cargar alertas"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <Row gutter={0} style={{ minHeight: '80vh', background: '#f4f6fa' }}>
      {/* Panel izquierdo: Preview, formulario o mensaje vacío */}
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
        {!showCreateForm && (
          <Button 
            type="primary" 
            style={{ 
              background: '#568E2B', 
              border: 'none', 
              width: isMobile ? '90%' : 180, 
              height: isMobile ? 36 : 40, 
              marginBottom: isMobile ? 16 : 32,
              fontSize: isMobile ? 14 : undefined
            }} 
            onClick={() => setShowCreateForm(true)}
          >
            Crear nueva alerta
          </Button>
        )}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '100%',
          padding: isMobile ? '16px' : '0'
        }}>
          {showCreateForm ? (
            <AlertCreateForm onCancel={() => setShowCreateForm(false)} catchmentPointId={selectedCatchmentPoint?.id ?? undefined} />
          ) : selectedAlert ? (
            <AlertDetail alert={selectedAlert} />
          ) : (
            <Card style={{ 
              border: 'none', 
              boxShadow: 'none', 
              background: 'transparent', 
              textAlign: 'center',
              width: isMobile ? '100%' : 'auto'
            }}>
              <div style={{ fontSize: isMobile ? 36 : 48, color: '#b0b8c9', marginBottom: 16 }}>
                <span role="img" aria-label="document">📄</span>
              </div>
              <div style={{ color: '#64748B', fontSize: isMobile ? 14 : 16 }}>
                Seleccione un documento para previsualizar
              </div>
            </Card>
          )}
        </div>
      </Col>
      {/* Panel derecho: Listado de alertas */}
      <Col 
        xs={24} 
        md={16} 
        style={{ 
          padding: isMobile ? '16px' : '32px 24px 0 24px',
          minHeight: isMobile ? 'auto' : '80vh'
        }}
      >
        {/* Header global lo maneja AppLayout */}
        <AlertList alerts={transformedAlerts} onSelect={setSelectedAlert} selectedKey={selectedAlert?.key} />
      </Col>
    </Row>
  );
};

export default AlertsPage; 