import React from 'react';
import { Form, Input, Button } from 'antd';
import type { Group } from '../../types/group';

interface GroupFormProps {
  initialValues?: Partial<Omit<Group, 'id' | 'created_at' | 'updated_at'>>;
  onSubmit: (values: Omit<Group, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading?: boolean;
}

const GroupForm: React.FC<GroupFormProps> = ({ initialValues, onSubmit, isLoading }) => {
  const [form] = Form.useForm<Omit<Group, 'id' | 'created_at' | 'updated_at'>>();

  const handleFinish = (values: Omit<Group, 'id' | 'created_at' | 'updated_at'>) => {
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
      <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Nombre requerido' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Descripción">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GroupForm;