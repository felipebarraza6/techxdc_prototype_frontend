import React from 'react';
import { Card, Button, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import './DgaMMECard.css';

const { Text } = Typography;

interface CardComponentProps {
  date_time_medition: string;
  flow: string;
  total: number;
  water_table: string;
  onCardClick?: () => void;
}

const DgaMEECard: React.FC<CardComponentProps> = ({ date_time_medition, flow, total, water_table, onCardClick }) => {
  return (
    <Card className="custom-card">
      <div className="card-header">
        <Text strong style={{ fontSize: 14 }}>Fecha/Hora Medición</Text>
        <p style={{ fontSize: 12 }}>{date_time_medition.split('T')[0]}</p>
      </div>

      <div className='card-line'></div>

      <div className="card-content-metrics">
        <div className="metric-item">
          <div className="metric-label-container">
            <Text className="metric-label">Caudal</Text>
          </div>
          <p className="metric-value">{Number(flow).toLocaleString('es-CL')}</p>
        </div>

        <div className="metric-item">
          <div className="metric-label-container">
            <Text className="metric-label">Total</Text>
          </div>
          <p className="metric-value">{total.toLocaleString('es-CL')}</p>
        </div>

        <div className="metric-item">
          <div className="metric-label-container">
            <Text className="metric-label">Nivel Freático</Text>
          </div>
          <p className="metric-value">{Number(water_table).toLocaleString('es-CL')}</p>
        </div>
      </div>

      <Button
        type="primary"
        icon={<FileTextOutlined />}
        size="large"
        className="compliance-button"
        style={{ fontSize: 14 }}
        onClick={onCardClick}
      >
        Cumplimiento MEE
      </Button>
    </Card>
  );
};

export default DgaMEECard;