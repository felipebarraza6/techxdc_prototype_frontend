import React from 'react';
import { Form, Input, Button, message } from 'antd';
import type { FormProps } from 'antd';
import { useFormContext } from '../../hooks/useFormContext';
import { useFormErrors } from '../../hooks/useFormErrors';
import styles from './LoginForm.module.css';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [form] = Form.useForm();
  const { resetForm } = useFormContext();
  const { errors, setFieldError, clearAllErrors } = useFormErrors<LoginFormValues>();

  // ===============================
  // Manejo del submit del formulario
  // ===============================
  // Si el login falla, solo se limpia el campo de password
  const onFinish: FormProps<LoginFormValues>['onFinish'] = async (values) => {
    clearAllErrors();
    // Validación simple
    if (!values.email || !values.password) {
      message.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    // Llamar a la función de login y esperar el resultado
    const result = await onSubmit({
      email: values.email,
      password: values.password,
    });
    // Si el login falla, solo limpiar el campo de password
    if (!result.success) {
      form.setFieldsValue({ password: '' });
    } else {
      // Si el login es exitoso, limpiar todo el formulario
      form.resetFields();
      resetForm();
    }
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
          style={{ background: '#568E2B', border: 'none', color: '#fff' }}
        >
          Ingresar
        </Button>
      </div>
    </Form >
  );
};

export default LoginForm;