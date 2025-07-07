import React, { useState } from 'react';
import { Modal } from 'antd';
import type { Client } from '../../types/client';
import { UserOutlined } from '@ant-design/icons';
import styles from './ClientCard.module.css';

interface ClientCardProps {
  client: Client;
  selected?: boolean;
  onClick?: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, selected, onClick }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Datos mock para mediciones
  const mediciones = [
    { valor: '0 m³', hora: '20:00 hrs' },
    { valor: '0 m³', hora: '21:00 hrs' },
    { valor: '0 m³', hora: '22:00 hrs' },
  ];

  const handleOk = () => {
    // onDelete(client.id);
    setModalOpen(false);
  };
  const handleCancel = () => setModalOpen(false);

  return (
    <>
      <div
        className={styles.responsiveCard}
        style={{
          border: selected ? '1.5px solid #1890FF' : '1px solid #E5E7EB',
          borderRadius: 12,
          background: '#fff',
          boxShadow: selected
            ? '0 4px 16px 0 rgba(24,144,255,0.10)'
            : '0 2px 8px 0 rgba(44,61,102,0.04)',
          padding: 20,
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: 16,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'border 0.2s, box-shadow 0.2s',
        }}
        onClick={onClick}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <UserOutlined style={{ fontSize: 32, color: '#1C355F' }} />
          <span style={{ fontWeight: 700, color: '#1C355F', fontSize: 22 }}>{client.name}</span>
        </div>
        <div style={{ color: '#64748B', fontSize: 16, marginBottom: 8, fontStyle: 'italic', marginLeft: 40 }}>
          Descripción
        </div>
        <div style={{ width: '100%', borderBottom: '1px solid #E5E7EB', marginBottom: 16 }} />
        <div style={{ width: '100%' }}>
          <div style={{ fontWeight: 600, color: '#1C355F', fontSize: 16, marginBottom: 16, textAlign: 'left' }}>
            Últimas Mediciones
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 0 }}>
            {mediciones.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <span style={{ fontWeight: 700, fontSize: 28, color: '#232F3E', minWidth: 90, textAlign: 'right' }}>{m.valor}</span>
                <span style={{ fontWeight: 600, fontSize: 24, color: '#7B8794', marginLeft: 24 }}>{m.hora}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        title="¿Eliminar cliente?"
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Sí"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <p>¿Estás seguro de eliminar a {client.name}?</p>
      </Modal>
    </>
  );
};

export default ClientCard;