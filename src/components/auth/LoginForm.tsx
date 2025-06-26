import React from 'react';
import { Form, Input, Button, message } from 'antd';
import type { FormProps } from 'antd';
import { useFormContext } from '../../hooks/useFormContext';
import { useAuthPayload } from '../../hooks/useAuthPayload';
import { useFormErrors } from '../../hooks/useFormErrors';
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
  const { setFieldValue, resetForm } = useFormContext();
  const { getLoginPayload } = useAuthPayload();
  const { errors, setFieldError, clearAllErrors } = useFormErrors<LoginFormValues>();

  const onFinish: FormProps<LoginFormValues>['onFinish'] = (values) => {
    clearAllErrors();
    let hasError = false;
    if (!values.email) {
      setFieldError('email', 'Verifica tu email');
      hasError = true;
    }
    if (!values.password) {
      setFieldError('password', 'Verifica tu contraseña');
      hasError = true;
    }
    if (hasError) {
      message.error('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }
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
      className={styles.formContainer}
    >
      <Form.Item
        name="email"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email}
        rules={[
          { required: true, message: '¡Por favor, ingresa tu email!' },
          { type: 'email', message: '¡El formato del email no es válido!' },
        ]}
      >
        <Input
          className={styles.input}
          placeholder="usuario"
          type="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        validateStatus={errors.password ? 'error' : ''}
        help={errors.password}
        rules={[{ required: true, message: '¡Por favor, ingresa tu contraseña!' }]}
      >
        <Input.Password
          className={styles.input}
          placeholder="contraseña"
        />
      </Form.Item>
      <div className={styles.info}>
        ¿Olvidaste tu contraseña? Comunícate con SmartHydro.
      </div>

      <div className={styles.buttonRow}>
        <Button
          className={styles.loginButton}
          htmlType="submit"
          loading={isLoading}
        >
          Ingresar
        </Button>
      </div>
    </Form >
  );
};

export default LoginForm;