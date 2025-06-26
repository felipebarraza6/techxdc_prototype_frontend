import React from 'react';
import { Form, Input, Button, Typography, Checkbox, DatePicker } from 'antd';
import type { Client } from '../../types/client';
import { useFormErrors } from '../../hooks/useFormErrors';
import styles from './ClientForm.module.css';

const { Title } = Typography;

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
      className={styles.clientForm}
    >
      <div className={styles.formHeader}>
        <div className={styles.headerIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.96C6.03 13.99 10 12.9 12 12.9C14 12.9 17.97 13.99 18 15.96C16.71 17.92 14.5 19.2 12 19.2Z" fill="#333" />
          </svg>
        </div>
        <Title level={4} className={styles.headerTitle}>Crear nuevo cliente</Title>

      </div>

      <div className={styles.formColumns}>
        <div className={styles.column}>
          <Form.Item name="name" label="Nombre de punto" validateStatus={errors.name ? 'error' : ''} help={errors.name} rules={[{ required: true, message: 'Nombre requerido' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="token_servicio" label="Token de servicio">
            <Input />
          </Form.Item>
          <Form.Item name="profundidad" label="Profundidad (mt)">
            <Input />
          </Form.Item>
          <Form.Item name="posicionamiento_bomba" label="Posicionamiento de bomba (mt)">
            <Input />
          </Form.Item>
          <Form.Item name="posicionamiento_nivel" label="Posicionamiento nivel (mt)">
            <Input />
          </Form.Item>
          <Form.Item name="diametro_ducto_salida" label="Diámetro ducto salida bomba (pulg)">
            <Input />
          </Form.Item>
          <Form.Item name="activar_telemetria" valuePropName="checked">
            <Checkbox>Activar telemetría</Checkbox>
          </Form.Item>
          <Form.Item name="activar_cumplimiento" valuePropName="checked">
            <Checkbox>Activar cumplimiento</Checkbox>
          </Form.Item>
        </div>

        <div className={styles.column}>
          <Form.Item name="diametro_flujometro" label="Diámetro flujometro (pulg)">
            <Input />
          </Form.Item>
          <Form.Item name="caudalimetro_inicial" label="Caudalimetro inicial">
            <Input />
          </Form.Item>
          <Form.Item name="caudal_otorgado" label="Caudal otorgado">
            <Input />
          </Form.Item>
          <Form.Item name="totalizado_otorgado" label="Totalizado otorgado">
            <Input />
          </Form.Item>
          <Form.Item name="shac" label="SHAC">
            <Input />
          </Form.Item>
          <Form.Item name="diametro_ducto_salida_bomba_2" label="Diámetro ducto salida bomba (pulg)">
            <Input />
          </Form.Item>
        </div>

        <div className={styles.column}>
          <Form.Item name="estandar" label="Estándar">
            <Checkbox.Group>
              <Checkbox value="mayor">Mayor</Checkbox>
              <Checkbox value="medio">Medio</Checkbox>
              <Checkbox value="menor">Menor</Checkbox>
              <Checkbox value="muy_pequeno">Caudal muy pequeño</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="tipo_captacion" label="Tipo de captación">
            <Checkbox.Group>
              <Checkbox value="superficial">Superficial</Checkbox>
              <Checkbox value="subterranea">Subterránea</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="fecha_creacion_dga" label="Fecha código de creación DGA">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="fecha_envio_dga" label="Fecha inicio envio DGA">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="fecha_inicio_telemetria" label="Fecha inicio telemetría">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="fecha_acta_entrega" label="Fecha acta de entrega">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </div>
      </div>

      <Form.Item className={styles.formButtons}>
        <Button onClick={() => form.resetFields()}>Cancelar</Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ClientForm;