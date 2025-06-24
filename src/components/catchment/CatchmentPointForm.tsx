import React from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import type { CatchmentPoint } from '../../hooks/useCatchmentPoint';
import { useFormErrors } from '../../hooks/useFormErrors';
import { useProjectList } from '../../hooks/useProjectList';
import { useUsersList } from '../../hooks/useUserList';

type CatchmentPointFormValues = Omit<CatchmentPoint, 'id' | 'created' | 'modified'>;

interface CatchmentPointFormProps {
  initialValues?: Partial<CatchmentPointFormValues>;
  onSubmit: (values: CatchmentPointFormValues) => void;
  isLoading?: boolean;
}

const CatchmentPointForm: React.FC<CatchmentPointFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
  const [form] = Form.useForm<CatchmentPointFormValues>();
  const { errors, setFieldError, clearAllErrors } = useFormErrors<CatchmentPointFormValues>();
  const { projects } = useProjectList();
  const { users } = useUsersList();

  const handleFinish = (values: CatchmentPointFormValues) => {
    clearAllErrors();
    let hasError = false;
    if (!values.title) {
      setFieldError('title', 'El nombre es requerido');
      hasError = true;
    }
    if (!values.project) {
      setFieldError('project', 'El proyecto es requerido');
      hasError = true;
    }
    if (!values.owner_user) {
      setFieldError('owner_user', 'El propietario es requerido');
      hasError = true;
    }
    if (hasError) return;
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <Form.Item
        name="title"
        label="Nombre"
        validateStatus={errors.title ? 'error' : ''}
        help={errors.title}
        rules={[{ required: true, message: 'El nombre es requerido' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="frecuency"
        label="Frecuencia"
        rules={[{ required: true, message: 'La frecuencia es requerida' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="project"
        label="Proyecto"
        validateStatus={errors.project ? 'error' : ''}
        help={errors.project}
        rules={[{ required: true, message: 'El proyecto es requerido' }]}
      >
        <Select
          placeholder="Selecciona un proyecto"
          options={projects.map(p => ({ value: p.id, label: p.name }))}
        />
      </Form.Item>
      <Form.Item
        name="owner_user"
        label="Propietario"
        validateStatus={errors.owner_user ? 'error' : ''}
        help={errors.owner_user}
        rules={[{ required: true, message: 'El propietario es requerido' }]}
      >
        <Select
          placeholder="Selecciona un usuario"
          options={users.map(u => ({ value: u.id, label: u.username }))}
        />
      </Form.Item>
      <Form.Item
        name="users_viewers"
        label="Usuarios con acceso"
      >
        <Select
          mode="multiple"
          placeholder="Selecciona usuarios"
          options={users.map(u => ({ value: u.id, label: u.username }))}
        />
      </Form.Item>
      <Form.Item name="is_thethings" valuePropName="checked">
        <Checkbox>TheThings</Checkbox>
      </Form.Item>
      <Form.Item name="is_tdata" valuePropName="checked">
        <Checkbox>TData</Checkbox>
      </Form.Item>
      <Form.Item name="is_novus" valuePropName="checked">
        <Checkbox>Novus</Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CatchmentPointForm;