import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { useFormContext } from '../../hooks/useFormContext';
import { useAuthPayload } from '../../hooks/useAuthPayload';

export interface RegisterFormValues {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm: string;
}

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
  isLoading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [form] = Form.useForm();
  const { setFieldValue, setFieldError, resetForm } = useFormContext();
  const { getRegisterPayload } = useAuthPayload();

  const onFinish = (values: RegisterFormValues) => {
    setFieldValue('username', values.username);
    setFieldValue('email', values.email);
    setFieldValue('first_name', values.first_name);
    setFieldValue('last_name', values.last_name);
    setFieldValue('password', values.password);
    // No enviamos 'confirm' al backend, solo lo usamos para validación local

    const payload = getRegisterPayload();
    onSubmit({
      username: String(payload.username),
      email: String(payload.email),
      first_name: String(payload.first_name),
      last_name: String(payload.last_name),
      password: String(payload.password),
      confirm: values.confirm,
    });
    form.resetFields();
    resetForm();
  };

  const onFinishFailed: FormProps<RegisterFormValues>['onFinishFailed'] = () => {
    setFieldError('email', 'Verifica tu email');
    setFieldError('password', 'Verifica tu contraseña');
    message.error('Por favor, completa todos los campos requeridos correctamente.');
  };

  return (
    <Form
      form={form}
      name="register_form"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '¡Por favor, ingresa tu nombre de usuario!' }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Nombre de Usuario"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: '¡Por favor, ingresa tu email!' },
          { type: 'email', message: '¡El formato del email no es válido!' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
          type="email"
        />
      </Form.Item>

      <Form.Item
        name="first_name"
        rules={[{ required: true, message: '¡Por favor, ingresa tu nombre!' }]}
      >
        <Input
          prefix={<IdcardOutlined />}
          placeholder="Nombre"
        />
      </Form.Item>

      <Form.Item
        name="last_name"
        rules={[{ required: true, message: '¡Por favor, ingresa tu apellido!' }]}
      >
        <Input
          prefix={<IdcardOutlined />}
          placeholder="Apellido"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: '¡Por favor, ingresa tu contraseña!' },
          { min: 6, message: 'La contraseña debe tener al menos 6 caracteres.' },
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Contraseña"
        />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: '¡Por favor, confirma tu contraseña!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('¡Las dos contraseñas no coinciden!'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirmar Contraseña"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={isLoading}>
          Registrarse
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;