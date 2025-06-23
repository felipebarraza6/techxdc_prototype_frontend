import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatchmentPoint } from '../../hooks/useCatchmentPoint';
import CatchmentPointForm from '../../components/catchment/CatchmentPointForm';
import type { CatchmentPoint } from '../../hooks/useCatchmentPoint';

type CatchmentPointFormValues = Omit<CatchmentPoint, 'id' | 'created' | 'modified'>;

const CatchmentPointCreatePage: React.FC = () => {
  const { create, loading } = useCatchmentPoint();
  const navigate = useNavigate();

  const handleSubmit = async (values: CatchmentPointFormValues) => {
    await create(values);
    navigate('/catchment');
  };

  return (
    <div>
      <h2>Nuevo Punto de Captación</h2>
      <CatchmentPointForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default CatchmentPointCreatePage;