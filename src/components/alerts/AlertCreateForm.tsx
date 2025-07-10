import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Alert, Space, Modal, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

interface Variable {
  id: number;
  label: string;
  type_variable: string;
  str_variable: string;
  name?: string;
  unit?: string;
  // otros campos posibles
}

interface AlertCreateFormProps {
  onCancel?: () => void;
  catchmentPointId: number;
}

const AlertCreateForm: React.FC<AlertCreateFormProps> = ({ onCancel, catchmentPointId }) => {
  const [form] = Form.useForm();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [variablesLoading, setVariablesLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    // Consumir la API de smarthydro para poblar el select de variables
    const fetchVariables = async () => {
      setVariablesLoading(true);
      try {
        // Usar la URL absoluta de la API de smarthydro
        const res = await axios.get('https://api.smarthydro.app/api/variable/', {
          headers: { Authorization: 'Token 07e5d496bd9ad1a3edfda2d94f7b5b238ee94f97' }
        });
        
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.results)
            ? res.data.results
            : Array.isArray(res.data.data)
              ? res.data.data
              : [];
        setVariables(arr);
      } catch (e) {
        setVariables([]);
      } finally {
        setVariablesLoading(false);
      }
    };
    fetchVariables();
  }, []);

  const handleCreate = (values: any) => {
    setFormValues(values);
    setCreateModalOpen(true);
  };

  const handleConfirmCreate = async () => {
    setLoading(true);
    setError(null);
    setModalError(null);
    try {
      // Buscar la variable seleccionada
      const selectedVariable = variables.find(v => v.id === formValues.variable);
     
      const payload = {
        title: formValues.nombre,
        description: `Variable: ${selectedVariable ? selectedVariable.label : formValues.variable}, Condición: ${formValues.condicion}, Valor: ${formValues.valor}, Email: ${formValues.email}`,
        priority: 'Media',
        created_by: 123, // dummy
        client_id: 1,   // Reemplazar por logica id del cliente real cuando se integre la selección de clientes
        designated: 123, // dummy
        custom_fields: {
          catchmentPointId,
          variableId: formValues.variable,
          variableName: selectedVariable ? selectedVariable.label : undefined,
          valor: formValues.valor,
          condicion: formValues.condicion,
        },
      };
      await axios.post('/api/tickets/', payload);
      setCreateModalOpen(false);
      form.resetFields();
      message.success('¡Alerta creada exitosamente!');
      if (onCancel) onCancel();
    } catch (err: any) {
      setModalError(err.response?.data?.message || err.message || 'Error al crear la alerta');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setCreateModalOpen(false);
    setModalError(null);
    // No llamar onCancel aquí, así el formulario sigue activo para editar
  };

  // Filtrar variables: solo una por label y excluir las que tengan '3gre'
  const uniqueVariables: Variable[] = [];
  const seenLabels = new Set<string>();
  for (const v of variables) {
    const labelLower = v.label?.toLowerCase() || '';
    const typeLower = v.type_variable?.toLowerCase() || '';
    if ((labelLower.includes('3gre') || typeLower.includes('3gre'))) continue;
    if (!seenLabels.has(v.label)) {
      uniqueVariables.push(v);
      seenLabels.add(v.label);
    }
  }

  return (
    <>
      <Form 
        form={form}
        layout="vertical" 
        style={{ width: '100%', maxWidth: 340, margin: '0 auto' }} 
        onFinish={handleCreate}
      >
        <Alert
          message={
            <span>
              <InfoCircleOutlined style={{ color: '#3368AB', marginRight: 8 }} />
              Las alertas operan bajo el último dato almacenado
            </span>
          }
          type="info"
          showIcon={false}
          style={{ marginBottom: 20, background: '#F4F8FE', border: '1px solid #B6D0F7', borderRadius: 8, color: '#3368AB', fontWeight: 500 }}
        />
        <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Ingrese un nombre' }]}> 
          <Input placeholder="Describe brevemente el problema" />
        </Form.Item>
        <Form.Item label="Variable" name="variable" rules={[{ required: true, message: 'Seleccione una variable' }]}> 
          <Select 
            placeholder="Seleccione una opción" 
            loading={variablesLoading} 
            allowClear 
            showSearch 
            optionFilterProp="children"
            dropdownStyle={{ background: '#fff' }}
          >
            {uniqueVariables.map((v, i) => (
              <Option 
                key={v.id ?? i} 
                value={v.id}
                style={{ color: '#222', background: '#fff' }}
              >
                {v.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Condición" name="condicion" rules={[{ required: true, message: 'Seleccione una condición' }]}> 
          <Select placeholder="Seleccione una opción">
            <Option value="mayor">Mayor que</Option>
            <Option value="menor">Menor que</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Valor" name="valor" extra="Esta condición se aplicará al valor de la variable seleccionada." rules={[{ required: true, message: 'Ingrese un valor' }]}> 
          <Input type="number" placeholder="0" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Ingrese un email válido' }]}> 
          <Input placeholder="usuario@dominio.cl" type="email" />
        </Form.Item>
        {error && <Alert type="error" message={error} style={{ marginBottom: 12 }} />}
        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button style={{ borderRadius: 8 }} onClick={() => form.resetFields()}>Limpiar</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#568E2B', border: 'none', borderRadius: 8 }}>
              + Crear
            </Button>
          </Space>
        </Form.Item>
      </Form>
      
      {/* Modal de confirmación de creación */}
      <Modal
        open={createModalOpen}
        onOk={handleConfirmCreate}
        onCancel={handleCancelModal}
        okText="Confirmar"
        cancelText="Cancelar"
        confirmLoading={loading}
      >
        ¿Deseas crear la alerta?
        {modalError && <Alert type="error" message={modalError} style={{ marginTop: 16 }} />}
      </Modal>
    </>
  );
};

export default AlertCreateForm; 