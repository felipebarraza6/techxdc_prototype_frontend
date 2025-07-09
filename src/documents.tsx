import React, { useRef, useState } from 'react';
import { Card, Typography, Input, Button, message, List, Tabs, Tag, Modal } from 'antd';
import { DeleteOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import DocumentUploadForm from './components/forms/DocumentUploadForm';

const { Title, Text } = Typography;

interface Documento {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  archivo?: File;
}

const documentosIniciales: Documento[] = [
  {
    id: 1,
    nombre: 'Informe Técnico P2',
    descripcion: 'Informe técnico de instalación y configuración del pozo P2',
    fecha: '15-05-25',
  },
  {
    id: 2,
    nombre: 'Plano de Ubicación',
    descripcion: 'Plano detallado de la ubicación geográfica del pozo P2',
    fecha: '22-04-25',
  },
  {
    id: 3,
    nombre: 'Registro de Mantenimiento',
    descripcion: 'Historial de mantenimientos realizados en el pozo P2',
    fecha: '05-04-25',
  },
];

const DocumentosPage: React.FC = () => {
  const [documentos, setDocumentos] = useState<Documento[]>(documentosIniciales);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Documento | null>(null);
  const [tabKey, setTabKey] = useState('1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (!nombre || !archivo) {
      message.warning('Debe ingresar el nombre y seleccionar un archivo.');
      return;
    }
    const nuevoDoc: Documento = {
      id: Date.now(),
      nombre,
      descripcion,
      fecha: new Date().toLocaleDateString('es-CL'),
      archivo,
    };
    setDocumentos([nuevoDoc, ...documentos]);
    setNombre('');
    setDescripcion('');
    setArchivo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    message.success('Documento cargado exitosamente.');
  };

  const handleRemove = (id: number) => {
    Modal.confirm({
      title: '¿Eliminar documento?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => setDocumentos(documentos.filter(doc => doc.id !== id)),
    });
  };

  const handleClear = () => {
    setNombre('');
    setDescripcion('');
    setArchivo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePreview = (doc: Documento) => {
    setPreviewDoc(doc);
  };

  const handleTabChange = (key: string) => {
    setTabKey(key);
    setPreviewDoc(null);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 32px)', background: '#fff', padding: 24 }}>
      {/* Panel izquierdo */}
      <div style={{ width: 420, minWidth: 320, maxWidth: 480, borderRight: '1px solid #f0f0f0', paddingRight: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0, color: '#1C355F' }}>Documentos</Title>
          <Text type="secondary">Gestión Documental del Sistema</Text>
        </div>
        <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
          <DocumentUploadForm
            nombre={nombre}
            descripcion={descripcion}
            archivo={archivo}
            onNombreChange={setNombre}
            onDescripcionChange={setDescripcion}
            onArchivoChange={setArchivo}
            onSubmit={handleUpload}
            onClear={handleClear}
          />
        </Card>
        <Tabs
          activeKey={tabKey}
          onChange={handleTabChange}
          style={{ marginBottom: 8 }}
          items={[
            {
              key: '1',
              label: <span>Documentación P2 <Tag color="#3368AB">2</Tag></span>,
              children: null,
            },
            {
              key: '2',
              label: <span>Gestión documental Smart Hydro <Tag color="#3368AB">2</Tag></span>,
              children: null,
            },
          ]}
        />
        <Input.Search placeholder="Buscar documentos" style={{ marginBottom: 8 }} />
        <List
          dataSource={documentos}
          renderItem={doc => (
            <List.Item
              actions={[
                <Button icon={<EyeOutlined />} type="link" onClick={() => handlePreview(doc)} key="preview" />,
                <Button icon={<DeleteOutlined />} type="link" danger onClick={() => handleRemove(doc.id)} key="delete" />,
              ]}
              style={{ padding: 8, borderRadius: 6, marginBottom: 4, background: previewDoc?.id === doc.id ? '#f6ffed' : undefined }}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 22, color: doc.id === 3 ? '#52c41a' : '#1C355F' }} />}
                title={<span style={{ color: '#1C355F', fontWeight: 500 }}>{doc.nombre}</span>}
                description={<span style={{ fontSize: 13 }}>{doc.descripcion}</span>}
              />
              <div style={{ fontSize: 12, color: '#888', minWidth: 70 }}>{doc.fecha}</div>
            </List.Item>
          )}
          style={{ flex: 1, overflow: 'auto', minHeight: 120 }}
        />
      </div>
      {/* Panel derecho */}
      <div style={{ flex: 1, paddingLeft: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        {previewDoc ? (
          <Card style={{ width: '100%', maxWidth: 600, minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <FileTextOutlined style={{ fontSize: 64, color: '#1C355F', marginBottom: 16 }} />
            <Title level={4} style={{ color: '#1C355F', marginBottom: 0 }}>{previewDoc.nombre}</Title>
            <Text type="secondary" style={{ marginBottom: 8 }}>{previewDoc.descripcion}</Text>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Fecha: {previewDoc.fecha}</div>
            <Text style={{ color: '#568E2B' }}>Previsualización no disponible</Text>
          </Card>
        ) : (
          <div style={{ textAlign: 'center', color: '#888' }}>
            <FileTextOutlined style={{ fontSize: 64, marginBottom: 16 }} />
            <div style={{ fontSize: 18, marginBottom: 8 }}>Seleccione un documento para previsualizar</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentosPage;
