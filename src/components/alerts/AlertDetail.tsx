import React from 'react';

interface AlertDetailProps {
  alert: any;
}

const AlertDetail: React.FC<AlertDetailProps> = ({ alert }) => {
  if (!alert) return null;
  return (
    <div style={{ width: '100%', padding: 16 }}>
      <div style={{ fontWeight: 600, color: '#2C3D66', fontSize: 18, marginBottom: 8 }}>{alert.title}</div>
      <div style={{ color: '#64748B', fontSize: 15, marginBottom: 8 }}>{alert.description}</div>
      <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>
        Código: <b>{alert.code}</b> | Estado: <b>{alert.status}</b> | Prioridad: <b>{alert.priority}</b>
      </div>
      <div style={{ fontSize: 12, color: '#94A3B8' }}>
        Creada: {alert.created} | Actualizada: {alert.updated}
      </div>
    </div>
  );
};

export default AlertDetail; 