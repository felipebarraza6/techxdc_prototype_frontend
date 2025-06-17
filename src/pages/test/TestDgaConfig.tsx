import React, { useEffect, useState } from 'react';
import { useDgaConfigCatchment, type NewDgaDataConfig } from '../../hooks/useDgaConfigCatchment';

const defaultForm: NewDgaDataConfig = {
  send_dga: false,
  standard: '',
  type_dga: '',
  code_dga: '',
  flow_granted_dga: '0.00',
  total_granted_dga: null,
  shac: null,
  date_start_compliance: null,
  date_created_code: null,
  name_informant: '',
  rut_report_dga: '',
  password_dga_software: '',
  point_catchment: 0,
};

const DgaConfigList: React.FC = () => {
  const {
    dgaConfigs,
    currentDgaConfig,
    getAllDgaConfigs,
    createDgaConfig,
    patchDgaConfig,
    deleteDgaConfig,
    loading,
    error,
  } = useDgaConfigCatchment();

  const [form, setForm] = useState<NewDgaDataConfig>(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    getAllDgaConfigs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editId !== null) {
      await patchDgaConfig(editId, form);
    } else {
      await createDgaConfig(form);
    }
    setForm(defaultForm);
    setIsEditing(false);
    setEditId(null);
    getAllDgaConfigs();
  };

  const handleEdit = (id: number) => {
    const cfg = dgaConfigs.find(c => c.id === id);
    if (cfg) {
      setForm({ ...cfg });
      setIsEditing(true);
      setEditId(id);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta configuración?')) {
      await deleteDgaConfig(id);
      getAllDgaConfigs();
    }
  };

  return (
    <div>
      <h2>Gestión de Configuraciones DGA</h2>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h3>{isEditing ? 'Editar configuración' : 'Nueva configuración'}</h3>

        <input name="code_dga" value={form.code_dga || ''} onChange={handleChange} placeholder="Código DGA" />
        <input name="standard" value={form.standard} onChange={handleChange} placeholder="Estándar" />
        <input name="type_dga" value={form.type_dga} onChange={handleChange} placeholder="Tipo DGA" />
        <input name="flow_granted_dga" value={form.flow_granted_dga} onChange={handleChange} placeholder="Caudal" />
        <input name="name_informant" value={form.name_informant} onChange={handleChange} placeholder="Informante" />
        <input name="rut_report_dga" value={form.rut_report_dga} onChange={handleChange} placeholder="RUT" />
        <input name="password_dga_software" value={form.password_dga_software} onChange={handleChange} placeholder="Clave software" />
        <input name="point_catchment" type="number" value={form.point_catchment} onChange={handleChange} placeholder="Punto captación" />
        <br />
        <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
      </form>

      <ul>
        {dgaConfigs.map(cfg => (
          <li key={cfg.id}>
            <strong>{cfg.code_dga || '(Sin código)'}</strong> - {cfg.standard} - {cfg.type_dga}
            <button onClick={() => handleEdit(cfg.id)}>Editar</button>
            <button onClick={() => handleDelete(cfg.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {currentDgaConfig && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Detalle seleccionado</h3>
          <pre>{JSON.stringify(currentDgaConfig, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DgaConfigList;
