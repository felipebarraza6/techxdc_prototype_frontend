import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

const SupportPage: React.FC = () => {
  return (
    <Card style={{ margin: '0 auto', maxWidth: 600, marginTop: 32 }}>
      <Text style={{ fontSize: 16 }}>
        Aquí podrás gestionar tickets y solicitudes de ayuda. Pronto podrás ver el historial y crear nuevas solicitudes.
      </Text>
    </Card>
  );
};

export default SupportPage; 