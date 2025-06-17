import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { useFormContext } from '../../hooks/useFormContext';
import { useAuthPayload } from '../../hooks/useAuthPayload';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [form] = Form.useForm();
  const { setFieldValue, setFieldError, resetForm } = useFormContext();
  const { getLoginPayload } = useAuthPayload();

  const onFinish = (values: LoginFormValues) => {
    setFieldValue('email', values.email);
    setFieldValue('password', values.password);
    const payload = getLoginPayload();
    onSubmit({
      email: String(payload.email),
      password: String(payload.password),
    });
    form.resetFields();
    resetForm();
  };

  const onFinishFailed: FormProps<LoginFormValues>['onFinishFailed'] = () => {
    setFieldError('email', 'Verifica tu email');
    setFieldError('password', 'Verifica tu contraseña');
    message.error('Por favor, completa todos los campos requeridos correctamente.');
  };

  return (
    <Form
      form={form}
      name="login_form"
      initialValues={{ remember: true }}
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
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
          type="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: '¡Por favor, ingresa tu contraseña!' }]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Contraseña"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={isLoading}>
          Iniciar Sesión
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;