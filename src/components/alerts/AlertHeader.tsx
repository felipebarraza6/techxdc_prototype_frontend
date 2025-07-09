import React from 'react';

interface AlertHeaderProps {
  title: string;
  subtitle?: string;
}

const AlertHeader: React.FC<AlertHeaderProps> = ({ title, subtitle }) => (
  <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, color: '#2C3D66' }}>
    {title}
    {subtitle && (
      <div style={{ fontSize: 15, fontWeight: 400, color: '#64748B', marginTop: 2 }}>{subtitle}</div>
    )}
  </div>
);

export default AlertHeader; 