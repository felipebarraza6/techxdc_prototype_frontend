import React, { useEffect } from 'react';
import { Form, Input, Button, Switch, DatePicker, type FormProps } from 'antd';
import type { NewDgaDataConfig } from '../../hooks/useDgaConfigCatchment';
import { useFormContext } from '../../hooks/useFormContext';
import { useFormErrors } from '../../hooks/useFormErrors';
import { useDgaConfigCatchment } from '../../hooks/useDgaConfigCatchment';

const DgaConfigCatchmentForm: React.FC = () => {
  const {
    createDgaConfig,
    updateDgaConfig,
    currentDgaConfig,
  } = useDgaConfigCatchment();
  const [form] = Form.useForm<NewDgaDataConfig>();
  const { setFieldValue, resetForm } = useFormContext();
  const { errors, setFieldError, clearAllErrors } = useFormErrors<NewDgaDataConfig>();

  useEffect(() => {
    if (currentDgaConfig) {
      form.setFieldsValue({
        ...currentDgaConfig,
        date_start_compliance: currentDgaConfig.date_start_compliance
          ? currentDgaConfig.date_start_compliance
          : null,
      });
    } else {
      form.resetFields();
    }
    clearAllErrors();
  }, [currentDgaConfig, form, clearAllErrors]);

  const onFinish: FormProps<NewDgaDataConfig>['onFinish'] = async (values) => {
    clearAllErrors();
    if (currentDgaConfig) {
      await updateDgaConfig(currentDgaConfig.id, values);
    } else {
      await createDgaConfig(values);
    }
    resetForm();
    form.resetFields();
  };

  const onFinishFailed: FormProps<NewDgaDataConfig>['onFinishFailed'] = (info) => {
    clearAllErrors();
    info.errorFields.forEach((field) => {
      setFieldError(field.name[0] as keyof NewDgaDataConfig, field.errors[0]);
    });
  };

  const handleValuesChange: FormProps<NewDgaDataConfig>['onValuesChange'] = (changed) => {
    Object.keys(changed).forEach((key) => {
      setFieldValue(key as keyof NewDgaDataConfig, changed[key as keyof NewDgaDataConfig]);
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={handleValuesChange}
      initialValues={{
        send_dga: false,
      }}
    >
      <Form.Item
        label="Standard"
        name="standard"
        rules={[{ required: true, message: 'Por favor ingresa el estándar.' }]}
        validateStatus={errors.standard ? 'error' : ''}
        help={errors.standard}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Tipo DGA"
        name="type_dga"
        rules={[{ required: true, message: 'Por favor ingresa el tipo DGA.' }]}
        validateStatus={errors.type_dga ? 'error' : ''}
        help={errors.type_dga}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Código DGA" name="code_dga">
        <Input />
      </Form.Item>
      <Form.Item
        label="Caudal otorgado DGA"
        name="flow_granted_dga"
        rules={[{ required: true, message: 'Por favor ingresa el caudal otorgado.' }]}
        validateStatus={errors.flow_granted_dga ? 'error' : ''}
        help={errors.flow_granted_dga}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Total otorgado DGA" name="total_granted_dga">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="SHAC" name="shac">
        <Input />
      </Form.Item>
      <Form.Item label="Fecha inicio cumplimiento" name="date_start_compliance">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="Nombre informante"
        name="name_informant"
        rules={[{ required: true, message: 'Por favor ingresa el nombre del informante.' }]}
        validateStatus={errors.name_informant ? 'error' : ''}
        help={errors.name_informant}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="RUT reportante DGA"
        name="rut_report_dga"
        rules={[{ required: true, message: 'Por favor ingresa el RUT reportante.' }]}
        validateStatus={errors.rut_report_dga ? 'error' : ''}
        help={errors.rut_report_dga}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Contraseña software DGA"
        name="password_dga_software"
        rules={[{ required: true, message: 'Por favor ingresa la contraseña.' }]}
        validateStatus={errors.password_dga_software ? 'error' : ''}
        help={errors.password_dga_software}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Punto de captación"
        name="point_catchment"
        rules={[{ required: true, message: 'Por favor ingresa el punto de captación.' }]}
        validateStatus={errors.point_catchment ? 'error' : ''}
        help={errors.point_catchment}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Enviar a DGA" name="send_dga" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {currentDgaConfig ? 'Actualizar configuración' : 'Crear configuración'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DgaConfigCatchmentForm;