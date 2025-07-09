import React, { useEffect } from 'react';
import DgaAnalisisChart from '../../components/dga/DgaAnalisisChart';
import { Card, Flex, Spin, Typography, Alert, Row, Col } from 'antd';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';

interface Interaction {
    n_voucher: string | null;
    date_time_medition: string;
    flow: string | null;
    total: number | null;
    water_table: string | null;
}

const DGA_Analisis: React.FC = () => {
    const { interactions, getInteractionsByCatchmentPoint, loading } = useInteractionDetails();
    const { selectedCatchmentPoint } = useSelectedCatchmentPoint();
    const { Text } = Typography;
    // const userId = 2;

    
    useEffect(() => {
        if (selectedCatchmentPoint) {
            getInteractionsByCatchmentPoint(selectedCatchmentPoint.id);
        }
    }, [selectedCatchmentPoint, getInteractionsByCatchmentPoint]);


    if (!selectedCatchmentPoint) {
        return (
            <div style={{ marginTop: 24 }}>
                <Alert
                    message="Selecciona un punto de captación para ver el análisis DGA."
                    type="info"
                    showIcon
                    style={{ fontSize: 16 }}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', width: '100%' }}>
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

    function getFirstVoucherAndHora(interactions: Interaction[]): {
    n_voucher: string;
    hora: string;
    flow: string;
    total: number | string;
    water_table: string;
    } {
    const found = interactions.find(item => item.n_voucher != null);
    if (!found) {
        return {
        n_voucher: 'Sin dato',
        hora: 'Sin dato',
        flow: 'Sin dato',
        total: 0,
        water_table: 'Sin dato',
        };
    }
    return {
        n_voucher: found.n_voucher ?? 'Sin dato', 
        hora: new Date(found.date_time_medition).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        flow: found.flow?.toString() ?? 'Sin dato',
        total: found.total ?? 'Sin dato',
        water_table: found.water_table?.toString() ?? 'Sin dato',
        };
    }

    const { n_voucher, hora, flow, total, water_table } = getFirstVoucherAndHora(interactions);

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12} md={6} lg={6} xl={6} style={{ marginBottom: 16 }}>
                    <Card style={{ width: '100%' }}>
                        <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Última medición cargada</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 4 }}>{n_voucher}</Text>
                        </Flex>
                        <Flex align="center" vertical={true} style={{ width: '100%', borderTop: '1px solid #e8e8e8'}}>
                            <Flex align="center" justify="center" style={{ 
                                fontSize: 12, 
                                fontWeight: 'normal', 
                                marginTop: 16, 
                                backgroundColor: '#EAF4F8', 
                                border: 'solid 1px #7097D0', 
                                width: '95px',
                                height: '25px',
                                borderRadius: 4,
                                }}>{hora}</Flex>
                        </Flex>
                        <Flex gap='small' >
                            <Flex vertical={true} align="center" >
                                <Flex align="center" justify="center" style={{ 
                                    fontSize: 12, 
                                    fontWeight: 'normal', 
                                    marginTop: 16, 
                                    backgroundColor: '#D9D9D9', 
                                    width: '55px',
                                    height: '25px',
                                    borderRadius: 4,
                                    }}>Caudal</Flex>
                                    <Text style={{ fontSize: 12, fontWeight: 'normal', marginTop: 4 }}>
                                    {isNaN(Number(flow)) ? total : Number(flow).toLocaleString('es-CL')} lts/s
                                </Text>
                            </Flex>
                            <Flex vertical={true} align="center">
                                <Flex align="center" justify="center" style={{ 
                                    fontSize: 12, 
                                    fontWeight: 'normal', 
                                    marginTop: 16, 
                                    backgroundColor: '#D9D9D9', 
                                    width: '79px',
                                    height: '25px',
                                    borderRadius: 4,
                                    }}>Acumulado</Flex>
                                <Text style={{ fontSize: 12, fontWeight: 'normal', marginTop: 4 }}>
                                    {isNaN(Number(total)) ? total : Number(total).toLocaleString('es-CL')} m³
                                </Text>
                            </Flex>
                            <Flex vertical={true} align="center">
                                <Flex align="center" justify="center" style={{ 
                                    fontSize: 12, 
                                    fontWeight: 'normal', 
                                    marginTop: 16, 
                                    backgroundColor: '#D9D9D9', 
                                    width: '91px',
                                    height: '25px',
                                    borderRadius: 4,
                                    }}>Nivel freático</Flex>
                                <Text style={{ fontSize: 12, fontWeight: 'normal', marginTop: 4 }}>
                                    {isNaN(Number(water_table)) ? total : Number(water_table).toLocaleString('es-CL')} m³
                                </Text>
                            </Flex>
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6} style={{ marginBottom: 16 }}>
                    <Card style={{ width: '100%' }}>
                        <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Mediciones cargadas</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 4 }}>Cuenta con un número de comprobante</Text>
                        </Flex>
                        <Flex align="center" vertical={true} style={{ width: '100%', borderTop: '1px solid #e8e8e8'}}>
                            <Flex align="center" justify="center" style={{ 
                                fontSize: 14, 
                                fontWeight: 'bold', 
                                marginTop: 16, 
                                height: '25px',
                                borderRadius: 4,
                                }}>48 Mediciones</Flex>
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6} style={{ marginBottom: 16 }}>
                    <Card style={{ width: '100%' }}>
                        <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Mediciones en preparación</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 4 }}>Mediciones sin número de comprobante</Text>
                        </Flex>
                        <Flex align="center" vertical={true} style={{ width: '100%', borderTop: '1px solid #e8e8e8'}}>
                            <Flex align="center" justify="center" style={{ 
                                fontSize: 14, 
                                fontWeight: 'bold', 
                                marginTop: 16, 
                                height: '25px',
                                borderRadius: 4,
                                }}>0 Mediciones</Flex>
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6} style={{ marginBottom: 16 }}>
                    <Card style={{ width: '100%' }}>
                        <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Errores de envío a DGA</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 4 }}>Mediciones con error en su envío</Text>
                        </Flex>
                        <Flex align="center" vertical={true} style={{ width: '100%', borderTop: '1px solid #e8e8e8'}}>
                            <Flex align="center" justify="center" style={{ 
                                fontSize: 14, 
                                fontWeight: 'bold', 
                                marginTop: 16, 
                                height: '25px',
                                borderRadius: 4,
                                }}>0 Errores</Flex>
                        </Flex>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <DgaAnalisisChart />
                </Col>
            </Row>
        </div>
    );
};

export default DGA_Analisis;