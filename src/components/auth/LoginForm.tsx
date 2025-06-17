import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { LoginOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { useFormContext } from '../../context/Form/useFormContext';
import { useAuthPayload } from '../../hooks/useAuthPayload';
import styles from './LoginForm.module.css';

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

  const handleClear = () => {
    form.resetFields();
    resetForm();
  };

  return (
    <Form
      form={form}
      name="login_form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
      className={styles.formContainer}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: '¡Por favor, ingresa tu email!' },
          { type: 'email', message: '¡El formato del email no es válido!' },
        ]}
      >
        <Input
          className={styles.input}
          placeholder="Usuario"
          type="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: '¡Por favor, ingresa tu contraseña!' }]}
      >
        <Input.Password
          className={styles.input}
          placeholder="Clave"
        />
      </Form.Item>

      <div className={styles.buttonRow}>
        <Button
          className={styles.loginButton}
          icon={<LoginOutlined />}
          htmlType="submit"
          loading={isLoading}
        >
          Ingresar
        </Button>
        <Button
          className={styles.clearButton}
          icon={<DeleteOutlined />}
          htmlType="button"
          onClick={handleClear}
        >
          Limpiar
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;