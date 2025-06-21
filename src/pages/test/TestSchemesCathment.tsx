import React, { useEffect, useState } from 'react';
import { useSchemesCatchment, type NewSchemeCatchment } from '../../hooks/useSchemesCatchment';

const SchemesCatchmentTest = () => {
  const {
    schemes,
    loading,
    error,
    getAllSchemes,
    createScheme,
    updateScheme,
    patchScheme,
    deleteScheme,
  } = useSchemesCatchment();

  const [newScheme, setNewScheme] = useState<NewSchemeCatchment>({
    name: '',
    description: '',
    points_catchment: [],
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    getAllSchemes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewScheme(prev => ({
      ...prev,
      [name]: name === 'points_catchment'
        ? value.split(',').map(num => parseInt(num.trim()))
        : value,
    }));
  };

  const handleCreate = async () => {
    await createScheme(newScheme);
    setNewScheme({ name: '', description: '', points_catchment: [] });
  };

  const handleUpdate = async () => {
    if (editingId !== null) {
      await updateScheme(editingId, newScheme);
      setEditingId(null);
      setNewScheme({ name: '', description: '', points_catchment: [] });
    }
  };

  const handlePatchName = async (id: number, newName: string) => {
    await patchScheme(id, { name: newName });
  };

  const handleDelete = async (id: number) => {
    await deleteScheme(id);
  };

  return (
    <div>
      <h2>Gestión de Schemes</h2>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}

      <div style={{ marginBottom: '1em' }}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newScheme.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={newScheme.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="points_catchment"
          placeholder="IDs puntos (ej: 1,2,3)"
          value={newScheme.points_catchment.join(',')}
          onChange={handleInputChange}
        />
        {editingId === null ? (
          <button onClick={handleCreate}>Crear</button>
        ) : (
          <button onClick={handleUpdate}>Actualizar</button>
        )}
      </div>

      <ul>
        {schemes.map(scheme => (
          <li key={scheme.id}>
            <strong>{scheme.name}</strong> - {scheme.description} <br />
            Puntos: {scheme.points_catchment.join(', ')} <br />
            <button onClick={() => {
              setNewScheme({
                name: scheme.name,
                description: scheme.description,
                points_catchment: scheme.points_catchment,
              });
              setEditingId(scheme.id);
            }}>
              Editar
            </button>
            <button onClick={() => handlePatchName(scheme.id, scheme.name + ' (editado)')}>
              Patch nombre
            </button>
            <button onClick={() => handleDelete(scheme.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchemesCatchmentTest;
