import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import DgaMEECard from '../../components/dga/DgaMMECard';
import DgaData from '../../components/dga/DgaData';
import './DGA_MEE.css';

const DgaMEE: React.FC = () => {
  const { interactions, getAllInteractions, loading } = useInteractionDetails();

useEffect(() => {
  getAllInteractions().then(() => {
    console.log('Datos cargados:', interactions);
  });
}, []);

useEffect(() => {
  console.log('Loading:', loading);
}, [loading]);


  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className='main-container'>
        <div className='top-container'
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 270px)',
                gap: '16px',
                justifyContent: 'center',
            }}
        >
            {interactions.slice(0, 10).map((item) => (
                <DgaMEECard
                key={item.id}
                date_time_medition={item.date_time_medition}
                flow={item.flow}
                total={item.total}
                water_table={item.water_table}
                />
            ))}
        </div>
        <div className='bottom-container'>
            <div className='bottom-info'><DgaData /></div>
            <div className='bottom-info'></div>
            <div className='bottom-info'></div> 
        </div>
    </div>
  );
};

export default DgaMEE;
