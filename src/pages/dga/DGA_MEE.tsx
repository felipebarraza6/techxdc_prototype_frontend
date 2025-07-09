import React, { useEffect, useRef, useState } from 'react';
import { Spin, Col, Button, Typography, Flex, Alert } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import DgaMEECard from '../../components/dga/DgaMMECard';
import DgaData from '../../components/dga/DgaData';
import './DGA_MEE.css';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';

const { Text } = Typography;

const DgaMEE: React.FC = () => {
  const { interactions, getInteractionsByCatchmentPoint, loading } = useInteractionDetails();
  const { selectedCatchmentPoint } = useSelectedCatchmentPoint();
  const [codeDga, setCodeDga] = useState<string>("");
  const [totalUsage, setTotalUsage] = useState<number>(0);
  // const userId = 2;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);



  useEffect(() => {
    if (selectedCatchmentPoint) {
      getInteractionsByCatchmentPoint(selectedCatchmentPoint.id);
    }
  }, [selectedCatchmentPoint, getInteractionsByCatchmentPoint]);

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        console.log('containerWidth:', containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const containerPadding = 16;
  const availableWidth = Math.max(0, containerWidth - containerPadding);
  const cardsPerRow = Math.max(1, Math.floor(availableWidth / 265));
  const gap = cardsPerRow > 1
    ? Math.floor((availableWidth - (cardsPerRow * 265)) / (cardsPerRow - 1))
    : 0;

  if (!selectedCatchmentPoint) {
    return (
      <div style={{ marginTop: 24 }}>
        <Alert
          message="Selecciona un punto de captación para ver el análisis MEE."
          type="info"
          showIcon
          style={{ fontSize: 16 }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (interactions.length === 0) {
    return (
      <div style={{ marginTop: 24 }}>
        <Alert
          message="No hay mediciones disponibles para este punto de captación."
          type="info"
          showIcon
          style={{ fontSize: 16 }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 8 }} ref={containerRef}>
      <Flex justify="start" wrap="wrap" gap={gap}>
        {interactions.map((item) => (
            <DgaMEECard
              date_time_medition={item.date_time_medition}
              flow={item.flow}
              total={item.total}
              water_table={item.water_table}
            />
        ))}
      </Flex>
      <Flex justify="end" gap={"middle"} style={{ marginTop: 16 }}>
            <div className='circle-container'> {'<'} </div>
            <div className='circle-container'> {'1'} </div>
            <div className='circle-container'> {'2'} </div>
            <div className='circle-container'> {'3'} </div>
            <div className='circle-container'> {'4'} </div>
            <div className='circle-container'> {'5'} </div>
            <div className='circle-container'> {'>'} </div>
      </Flex>
      {/* Grid inferior */}
      {/* <Row gutter={16} style={{ marginTop: 32 }}> */}
      <Flex justify="start" wrap="wrap" gap="middle" style={{ marginTop: 16 }}>
        <Col span={8}>
            {selectedCatchmentPoint && (
              <DgaData
                id={selectedCatchmentPoint.id}
                lastFlow={Number(interactions[0].flow)}
                lastTotal={interactions[0].total}
                onDgaCode={setCodeDga}
                onTotalUsage={setTotalUsage}
              />
            )}
        </Col>
        <Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{width: '313px', height: '86px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '354px', height: '126px', backgroundColor: '#EAF4F8', borderRadius: '8px', border: 'solid 1px #5C88C9', padding: '20px', marginBottom: '20px' }}>
              <Text style={{fontSize: '14px', fontWeight: '500', marginBottom: '10px'}}>Has consumido {(interactions[0].total).toLocaleString('es-CL')} / {totalUsage.toLocaleString('es-CL')} m³ del total de tu consumo autorizado.</Text>
              <div style={{height: '10px', width: '313px', backgroundColor: '#B8D9E8', borderRadius: '8px'}}>
                <div style={{height: '10px', width: '32%', backgroundColor: '#5C88C9', borderRadius: '8px'}}></div>
              </div>
            </div>
            <Button 
              icon={<LinkOutlined />} 
              type="primary" 
              style={{ width: '226px', height: '40px', backgroundColor: '#425176'}}
              onClick={() => window.open(`https://snia.mop.gob.cl/cExtracciones2/#/consultaQR/${codeDga}`, '_blank')}
              >
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px'}}>
                <Text style={{fontSize: '14px', fontWeight: '400', color: 'white'}}>Validar Sincronización DGA</Text>
              </div>
            </Button>
          </div>
        </Col>
        <Col span={8} style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
        </Col>
        </Flex>
      {/* </Row> */}
    </div>
  );
};

export default DgaMEE;