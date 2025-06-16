import React, { useEffect, useState } from 'react';
import { useProfileConfigCatchment } from '../../hooks/useProfileConfigCatchment';

const TestUseProfileConfigCatchment: React.FC = () => {
  const {
    loading,
    error,
    profileDataConfigs,
    getProfileDataConfigs,
    createProfileDataConfig,
  } = useProfileConfigCatchment();

  const [newData, setNewData] = useState({
    token_service: '',
    d1: '',
    d2: '',
    d3: '',
    d4: '',
    d5: '',
    d6: 0,
    is_telemetry: false,
    date_start_telemetry: '',
    date_delivery_act: '',
    point_catchment: 1,
  });

  useEffect(() => {
    getProfileDataConfigs();
  }, []);

  const handleCreate = async () => {
    // Validación mínima
    if (!newData.token_service || !newData.d1) {
      alert('Faltan campos requeridos');
      return;
    }

    const created = await createProfileDataConfig({
      ...newData,
      date_start_telemetry: newData.date_start_telemetry || null,
      date_delivery_act: newData.date_delivery_act || null,
    });

    if (created) {
      alert('Nuevo perfil creado con éxito');
      getProfileDataConfigs();
    }
  };

  return (
    <div>
      <h2>Testeo de Perfil DGA</h2>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      <h3>Lista de Perfiles</h3>
      <ul>
        {profileDataConfigs.map((p) => (
          <li key={p.id}>
            ID: {p.id} | Token: {p.token_service} | D1: {p.d1} | Telemetría: {p.is_telemetry ? 'Sí' : 'No'}
          </li>
        ))}
      </ul>

      <h3>Crear Nuevo Perfil</h3>
      <input
        type="text"
        placeholder="token_service"
        value={newData.token_service}
        onChange={(e) => setNewData({ ...newData, token_service: e.target.value })}
      />
      <input
        type="text"
        placeholder="d1"
        value={newData.d1}
        onChange={(e) => setNewData({ ...newData, d1: e.target.value })}
      />
      <input
        type="text"
        placeholder="d2"
        value={newData.d2}
        onChange={(e) => setNewData({ ...newData, d2: e.target.value })}
      />
      <input
        type="text"
        placeholder="d3"
        value={newData.d3}
        onChange={(e) => setNewData({ ...newData, d3: e.target.value })}
      />
      <input
        type="text"
        placeholder="d4"
        value={newData.d4}
        onChange={(e) => setNewData({ ...newData, d4: e.target.value })}
      />
      <input
        type="text"
        placeholder="d5"
        value={newData.d5}
        onChange={(e) => setNewData({ ...newData, d5: e.target.value })}
      />
      <input
        type="number"
        placeholder="d6"
        value={newData.d6}
        onChange={(e) => setNewData({ ...newData, d6: parseFloat(e.target.value) })}
      />
      <label>
        <input
          type="checkbox"
          checked={newData.is_telemetry}
          onChange={(e) => setNewData({ ...newData, is_telemetry: e.target.checked })}
        />
        ¿Es telemetría?
      </label>
      <input
        type="date"
        placeholder="Fecha inicio telemetría"
        value={newData.date_start_telemetry}
        onChange={(e) => setNewData({ ...newData, date_start_telemetry: e.target.value })}
      />
      <input
        type="date"
        placeholder="Fecha entrega acta"
        value={newData.date_delivery_act}
        onChange={(e) => setNewData({ ...newData, date_delivery_act: e.target.value })}
      />
      <input
        type="number"
        placeholder="Punto de captación"
        value={newData.point_catchment}
        onChange={(e) => setNewData({ ...newData, point_catchment: parseInt(e.target.value) })}
      />
      <button onClick={handleCreate}>Crear</button>
    </div>
  );
};

export default TestUseProfileConfigCatchment;
