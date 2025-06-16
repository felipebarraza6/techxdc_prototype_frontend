import { useEffect, useState } from 'react';
import { useCatchmentPoint, type CatchmentPoint } from '../../hooks/useCatchmentPoint';


function CatchmentPointList() {
  const [pointId, setPointId] = useState<CatchmentPoint | null>(null);

  const {
    loading,
    error,
    catchmentPoints,
    getAll,
    getById,
    create
  } = useCatchmentPoint();

useEffect(() => {
  getAll();

  const fetchPoint = async () => {
    const data = await getById(6);
    if (data) {
      setPointId(data);
    }
  };

  fetchPoint();
}, []);
  const handleCreate = async () => {
    const newPoint = {
    title: 'Nuevo Punto',
    is_thethings: true,
    is_tdata: false,
    is_novus: false,
    frecuency: '60',
    project: 19,
    owner_user: 53,
    users_viewers: [53]
    };

    const created = await create(newPoint);
    if (created) {
      console.log('Nuevo punto creado:', created);
    }
  };

  console.log('catchmentPoints:', catchmentPoints);
  console.log('error:', error);

  return (
    <div>
      <h2>Puntos de Captación</h2>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

    <ul>
      {Array.isArray(catchmentPoints) && catchmentPoints.length > 0 ? (
        catchmentPoints.map(point => (
          <li key={point.id}>
            #{point.id} - {point.title} ({point.frecuency} min)
          </li>
        ))
      ) : (
        <li>No hay puntos de captación</li>
      )}
    </ul>

    {pointId &&
    <p>
      #{pointId.id} - {pointId.title} ({pointId.frecuency} min)
    </p>
    }


      <button onClick={handleCreate}>Crear nuevo punto</button>
    </div>
  );
}

export default CatchmentPointList;
