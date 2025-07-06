import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

const AlertsPage: React.FC = () => {
  return (
    <Card style={{ margin: '0 auto', maxWidth: 600, marginTop: 32 }}>
      <Text style={{ fontSize: 16 }}>
        Aquí se mostrarán las alertas del sistema. Puedes gestionar, ver el historial y configurar notificaciones.
      </Text>
    </Card>
  );
};

export default AlertsPage; 