import React, { useEffect, useRef, useState } from 'react';
import { Spin, Col, Button, Typography, Flex, Alert } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import DgaMEECard from '../../components/dga/DgaMMECard';
import DgaData from '../../components/dga/DgaData';
import './DGA_MEE.css';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';
import { Modal } from 'antd';

const { Text } = Typography;

interface Interaction {
  date_time_medition: string;
  flow: string;
  total: number;
  water_table: string;
  n_voucher: string | null;
  return_dga: string | null;
}

const DgaMEE: React.FC = () => {
  const { interactions, getInteractionsByCatchmentPoint, loading, totalCount } = useInteractionDetails();
  const { selectedCatchmentPoint } = useSelectedCatchmentPoint();
  const [codeDga, setCodeDga] = useState<string>("");
  const [totalUsage, setTotalUsage] = useState<number>(0);
  // const userId = 2;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadPage = async (page: number) => {
    if (!selectedCatchmentPoint) return;
    await getInteractionsByCatchmentPoint(selectedCatchmentPoint.id, page);
    setCurrentPage(page);
  };

  const openModal = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedInteraction(null);
  };

  useEffect(() => {
    console.log(interactions);
  }, [interactions]);

  useEffect(() => {
    if (selectedCatchmentPoint) {
      loadPage(1);
    }
  }, [selectedCatchmentPoint]);

  useEffect(() => {
    if (totalCount) {
      setTotalPages(Math.ceil(totalCount / 20)); // 20 es el limit en la consulta
    }
  }, [totalCount]);


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

  const maxPagesToShow = 5;

  // calcular el bloque actual, empieza en 0
  const currentBlock = Math.floor((currentPage - 1) / maxPagesToShow);

  // página inicial y final del bloque actual
  const startPage = currentBlock * maxPagesToShow + 1;
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  const pagesToShow = [];
  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }


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
              onCardClick={() => openModal(item)}
            />
        ))}
      </Flex>
      <Flex justify="end" gap={"middle"} style={{ marginTop: 16 }}>
        {/* Flecha para ir al bloque anterior */}
        <div
          className='circle-container'
          style={{ cursor: startPage > 1 ? 'pointer' : 'default', opacity: startPage > 1 ? 1 : 0.5 }}
          onClick={() => startPage > 1 && loadPage(startPage - 1)}
        >
          {'<'}
        </div>

        {/* Mostrar páginas del bloque actual */}
        {pagesToShow.map((page) => (
          <div
            key={page}
            className={`circle-container ${currentPage === page ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => loadPage(page)}
          >
            {page}
          </div>
        ))}

        {/* Flecha para ir al siguiente bloque */}
        <div
          className='circle-container'
          style={{ cursor: endPage < totalPages ? 'pointer' : 'default', opacity: endPage < totalPages ? 1 : 0.5 }}
          onClick={() => endPage < totalPages && loadPage(endPage + 1)}
        >
          {'>'}
        </div>
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
      <Modal
        title="Detalle de Medición"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {selectedInteraction && (
          <div>
            <p><strong>Respuesta servicio DGA:</strong> {selectedInteraction.return_dga}</p>
            <p><strong>Voucher:</strong> {selectedInteraction.n_voucher ?? 'No completado'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DgaMEE;