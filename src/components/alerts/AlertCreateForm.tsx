import React, { useState } from 'react';
import { Form, Input, Select, Button, Alert, Space, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const AlertCreateForm: React.FC = () => {
  const [form] = Form.useForm();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleConfirmCreate = () => {
    setCreateModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Form 
        form={form}
        layout="vertical" 
        style={{ width: '100%', maxWidth: 340, margin: '0 auto' }} 
        onFinish={handleCreate}
      >
        <Alert
          message={
            <span>
              <InfoCircleOutlined style={{ color: '#3368AB', marginRight: 8 }} />
              Las alertas operan bajo el último dato almacenado
            </span>
          }
          type="info"
          showIcon={false}
          style={{ marginBottom: 20, background: '#F4F8FE', border: '1px solid #B6D0F7', borderRadius: 8, color: '#3368AB', fontWeight: 500 }}
        />
        <Form.Item label="Nombre" name="nombre">
          <Input placeholder="Describe brevemente el problema" />
        </Form.Item>
        <Form.Item label="Variable" name="variable">
          <Select placeholder="Seleccione una opción">
            <Option value="var1">Variable 1</Option>
            <Option value="var2">Variable 2</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Condición" name="condicion">
          <Select placeholder="Seleccione una opción">
            <Option value="mayor">Mayor que</Option>
            <Option value="menor">Menor que</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Valor" name="valor" extra="Esta condición se aplicará al valor de la variable seleccionada.">
          <Input type="number" placeholder="0" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="usuario@dominio.cl" type="email" />
        </Form.Item>
        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button style={{ borderRadius: 8 }} onClick={() => form.resetFields()}>Limpiar</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#568E2B', border: 'none', borderRadius: 8 }}>
              + Crear
            </Button>
          </Space>
        </Form.Item>
      </Form>
      
      {/* Modal de confirmación de creación */}
      <Modal
        open={createModalOpen}
        onOk={handleConfirmCreate}
        onCancel={() => setCreateModalOpen(false)}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        ¿Deseas crear la alerta?
      </Modal>
    </>
  );
};

export default AlertCreateForm; 