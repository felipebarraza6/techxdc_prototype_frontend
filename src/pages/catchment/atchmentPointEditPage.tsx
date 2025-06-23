import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCatchmentPoint } from '../../hooks/useCatchmentPoint';
import CatchmentPointForm from '../../components/catchment/CatchmentPointForm';
import type { CatchmentPoint } from '../../hooks/useCatchmentPoint';

type CatchmentPointFormValues = Omit<CatchmentPoint, 'id' | 'created' | 'modified'>;

const CatchmentPointEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, currentPoint, getById, update } = useCatchmentPoint();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getById(Number(id));
  }, [id, getById]);

  const handleSubmit = async (values: CatchmentPointFormValues) => {
    if (!id) return;
    await update(Number(id), values);
    navigate('/catchment');
  };

  if (!currentPoint) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Editar Punto de Captación</h2>
      <CatchmentPointForm
        initialValues={currentPoint}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
};

export default CatchmentPointEditPage;