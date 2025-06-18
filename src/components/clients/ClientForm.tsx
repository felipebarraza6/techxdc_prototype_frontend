import React from 'react';
import { Form, Input, Button } from 'antd';
import type { Client } from '../../types/client';
import { useFormErrors } from '../../hooks/useFormErrors';

interface ClientFormProps {
  initialValues?: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>;
  onSubmit: (values: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialValues, onSubmit, isLoading }) => {
  const [form] = Form.useForm<Omit<Client, 'id' | 'created_at' | 'updated_at'>>();
  const { errors, setFieldError, clearAllErrors } = useFormErrors<Omit<Client, 'id' | 'created_at' | 'updated_at'>>();

  const handleFinish = (values: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    clearAllErrors();
    let hasError = false;
    if (!values.name) {
      setFieldError('name', 'Nombre requerido');
      hasError = true;
    }
    if (!values.email) {
      setFieldError('email', 'Email válido requerido');
      hasError = true;
    }
    if (hasError) return;
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <Form.Item
        name="name"
        label="Nombre"
        validateStatus={errors.name ? 'error' : ''}
        help={errors.name}
        rules={[{ required: true, message: 'Nombre requerido' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email}
        rules={[{ required: true, type: 'email', message: 'Email válido requerido' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Teléfono">
        <Input />
      </Form.Item>
      <Form.Item name="document_type" label="Tipo de Documento">
        <Input />
      </Form.Item>
      <Form.Item name="document_number" label="Número de Documento">
        <Input />
      </Form.Item>
      <Form.Item name="city" label="Ciudad">
        <Input />
      </Form.Item>
      <Form.Item name="country" label="País">
        <Input />
      </Form.Item>
      <Form.Item name="address" label="Dirección">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ClientForm;