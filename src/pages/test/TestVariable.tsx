import React, { useEffect, useState } from 'react';
import { useVariable, type NewVariable } from '../../hooks/useVariable';

export const VariableTestPage = () => {
  const {
    loading,
    error,
    variables,
    currentVariable,
    getAllVariables,
    getVariableById,
    createVariable,
    updateVariable,
    deleteVariable,
  } = useVariable();

  const [newVarData, setNewVarData] = useState<NewVariable>({
    str_variable: '',
    label: '',
    type_variable: '',
    token_service: null,
    service: null,
    pulses_factor: 1,
    addition: 0,
    convert_to_lt: false,
    calculate_nivel: null,
    scheme_catchment: 0,
  });

  const [updateLabel, setUpdateLabel] = useState('');

  useEffect(() => {
    getAllVariables();
  }, []);

  const handleSelectVariable = (id: number) => {
    getVariableById(id);
  };

  const handleCreate = async () => {
    if (!newVarData.str_variable || !newVarData.label) {
      alert('Completa los campos mínimos (str_variable, label)');
      return;
    }
    await createVariable(newVarData);
    setNewVarData({
      str_variable: '',
      label: '',
      type_variable: '',
      token_service: null,
      service: null,
      pulses_factor: 1,
      addition: 0,
      convert_to_lt: false,
      calculate_nivel: null,
      scheme_catchment: 0,
    });
    getAllVariables();
  };

  const handleUpdate = async () => {
    if (!currentVariable) return;
    await updateVariable(currentVariable.id, { label: updateLabel });
    getAllVariables();
    getVariableById(currentVariable.id);
  };

  const handleDelete = async () => {
    if (!currentVariable) return;
    await deleteVariable(currentVariable.id);
    getAllVariables();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Variables (Lista)</h2>
      {loading && <p>Cargando variables...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message || error.toString()}</p>}
      <ul>
        {variables.map(v => (
          <li key={v.id}>
            <button onClick={() => handleSelectVariable(v.id)}>
              {v.label} (ID: {v.id})
            </button>
          </li>
        ))}
      </ul>

      <h2>Crear nueva variable</h2>
      <input
        placeholder="str_variable"
        value={newVarData.str_variable}
        onChange={e => setNewVarData({ ...newVarData, str_variable: e.target.value })}
      />
      <input
        placeholder="label"
        value={newVarData.label}
        onChange={e => setNewVarData({ ...newVarData, label: e.target.value })}
      />
      <input
        placeholder="type_variable"
        value={newVarData.type_variable}
        onChange={e => setNewVarData({ ...newVarData, type_variable: e.target.value })}
      />
      <input
        type="number"
        placeholder="pulses_factor"
        value={newVarData.pulses_factor}
        onChange={e => setNewVarData({ ...newVarData, pulses_factor: Number(e.target.value) })}
      />
      <button onClick={handleCreate}>Crear</button>

      {currentVariable && (
        <>
          <h2>Detalle Variable Seleccionada</h2>
          <p>ID: {currentVariable.id}</p>
          <p>Str Variable: {currentVariable.str_variable}</p>
          <p>Label: {currentVariable.label}</p>
          <p>Type Variable: {currentVariable.type_variable}</p>
          <p>Pulses Factor: {currentVariable.pulses_factor}</p>

          <h3>Actualizar Label</h3>
          <input
            value={updateLabel}
            onChange={e => setUpdateLabel(e.target.value)}
            placeholder="Nuevo label"
          />
          <button onClick={handleUpdate}>Actualizar Label</button>

          <h3>Eliminar Variable</h3>
          <button onClick={handleDelete} style={{ color: 'red' }}>
            Eliminar
          </button>
        </>
      )}
    </div>
  );
};
