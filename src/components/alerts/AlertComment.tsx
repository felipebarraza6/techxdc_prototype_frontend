import React from 'react';
import { Avatar, Row, Col } from 'antd';
import { UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';

interface AlertCommentProps {
  author: string;
  date: string;
  text: string;
  type?: 'usuario' | 'soporte';
}

const AlertComment: React.FC<AlertCommentProps> = ({ author, date, text, type = 'usuario' }) => {
  return (
    <Row align="top" style={{ marginBottom: 12 }} gutter={8}>
      <Col>
        <Avatar
          style={{ backgroundColor: type === 'soporte' ? '#3368AB' : '#94A3B8' }}
          icon={type === 'soporte' ? <CustomerServiceOutlined /> : <UserOutlined />}
        />
      </Col>
      <Col flex="auto">
        <div style={{ fontWeight: 500, color: type === 'soporte' ? '#3368AB' : '#2C3D66', fontSize: 14 }}>{author}</div>
        <div style={{ color: '#64748B', fontSize: 14 }}>{text}</div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{date}</div>
      </Col>
    </Row>
  );
};

export default AlertComment; 