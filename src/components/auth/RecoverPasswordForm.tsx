import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';

export interface RecoverPasswordFormValues {
  email: string;
}

interface RecoverPasswordFormProps {
  onSubmit: (values: RecoverPasswordFormValues) => void;
  isLoading?: boolean;
}

const RecoverPasswordForm: React.FC<RecoverPasswordFormProps> = ({ onSubmit, isLoading }) => {
  const [form] = Form.useForm();

  const onFinish = (values: RecoverPasswordFormValues) => {
    onSubmit(values);
    form.resetFields();
  };

  const onFinishFailed: FormProps<RecoverPasswordFormValues>['onFinishFailed'] = (errorInfo) => {
    console.log('Fallo al enviar:', errorInfo);
    message.error('Por favor, ingresa tu email.');
  };

  return (
    <Form
      form={form}
      name="recover_password_form"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: '¡Por favor, ingresa tu email!' },
          { type: 'email', message: '¡El formato del email no es válido!' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email registrado"
          type="email"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={isLoading}>
          Enviar enlace de recuperación
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RecoverPasswordForm;