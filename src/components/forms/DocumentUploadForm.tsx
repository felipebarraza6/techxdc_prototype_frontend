import React, { useRef } from 'react';
import { Input, Button, Typography, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface Props {
  nombre: string;
  descripcion: string;
  archivo: File | null;
  onNombreChange: (value: string) => void;
  onDescripcionChange: (value: string) => void;
  onArchivoChange: (file: File | null) => void;
  onSubmit: () => void;
  onClear: () => void;
}

const DocumentUploadForm: React.FC<Props> = ({
  nombre,
  descripcion,
  archivo,
  onNombreChange,
  onDescripcionChange,
  onArchivoChange,
  onSubmit,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onArchivoChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <Typography.Text strong>Subir documento</Typography.Text>
      <div style={{ marginTop: 12 }}>
        <Input
          placeholder="Ingrese nombre del documento"
          value={nombre}
          onChange={e => onNombreChange(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <div style={{ marginBottom: 8 }}>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            icon={<UploadOutlined />}
            style={{ width: '100%', textAlign: 'left' }}
            onClick={() => fileInputRef.current?.click()}
          >
            {archivo ? archivo.name : 'Haga clic o arrastre el archivo aquí para cargarlo'}
          </Button>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
            Tamaño máximo de archivo: 10MB
          </div>
        </div>
        <TextArea
          placeholder="Ingrese una descripción del documento..."
          value={descripcion}
          onChange={e => onDescripcionChange(e.target.value)}
          rows={2}
          style={{ marginBottom: 8 }}
        />
        <Space>
          <Button onClick={onClear}>Limpiar</Button>
          <Button type="primary" style={{ background: '#568E2B', borderColor: '#568E2B' }} onClick={onSubmit}>
            Aceptar
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
