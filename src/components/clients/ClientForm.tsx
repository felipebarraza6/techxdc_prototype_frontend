import React from 'react';
import { Form, Input, Button, Typography, Checkbox, DatePicker, Row, Col, Switch, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
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
        <UserOutlined style={{ fontSize: 24, color: '#1C355F', marginRight: 8 }} />
        <Title level={4} className={styles.headerTitle} style={{ color: '#1C355F', fontWeight: 600, margin: 0 }}>Nombre de Cliente</Title>
      </div>
      <Row gutter={[24, 24]} className={styles.formColumns}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Form.Item name="name" label={<span style={{ color: '#1E293B', fontWeight: 600 }}>Nombre de punto</span>} validateStatus={errors.name ? 'error' : ''} help={errors.name} rules={[{ required: true, message: 'Nombre requerido' }]}> 
            <Input style={{ color: '#1E293B', fontWeight: 600 }} />
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            <Form.Item name="activar_telemetria" valuePropName="checked" style={{ marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Switch />
                <span style={{ color: '#1E293B', fontWeight: 600 }}>Activar telemetría</span>
              </span>
            </Form.Item>
            <Form.Item name="activar_cumplimiento" valuePropName="checked" style={{ marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Switch />
                <span style={{ color: '#1E293B', fontWeight: 600 }}>Activar cumplimiento</span>
              </span>
            </Form.Item>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
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
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Card bordered style={{ marginBottom: 16, borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 2px 8px 0 rgba(44,61,102,0.04)', background: '#fff', padding: 16, width: '100%' }} bodyStyle={{ padding: 0 }}>
            <Form.Item name="estandar" label="Estándar">
              <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Checkbox value="mayor">Mayor</Checkbox>
                <Checkbox value="medio">Medio</Checkbox>
                <Checkbox value="menor">Menor</Checkbox>
                <Checkbox value="muy_pequeno">Caudal muy pequeño</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Card>
          <Card bordered style={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 2px 8px 0 rgba(44,61,102,0.04)', background: '#fff', padding: 16, width: '100%' }} bodyStyle={{ padding: 0 }}>
            <Form.Item name="tipo_captacion" label="Tipo de captación">
              <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Checkbox value="superficial">Superficial</Checkbox>
                <Checkbox value="subterranea">Subterránea</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Card>
          <Form.Item name="fecha_creacion_dga" label="Fecha código de creación DGA">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="fecha_envio_dga" label="Fecha inicio envio DGA">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="fecha_inicio_telemetria" label="Fecha inicio telemetría">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, width: '100%' }}>
            <Form.Item name="fecha_acta_entrega" label="Fecha acta de entrega" style={{ flex: 1, marginBottom: 0 }}>
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <div className={styles.formButtons}>
            <Button onClick={() => form.resetFields()} style={{ background: '#1C355F', color: '#fff',border: 'none' }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading} style={{ background: '#568E2B', border: 'none' }}>
              Guardar
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default ClientForm;