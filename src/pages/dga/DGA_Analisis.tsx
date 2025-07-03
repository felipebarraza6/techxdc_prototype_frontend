import React, { useEffect } from 'react';
import DgaAnalisisChart from '../../components/dga/DgaAnalisisChart';
import { Card, Flex, Spin, Typography } from 'antd';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';

const DGA_Analisis: React.FC = () => {
    const { interactions, getInteractionsByCatchmentPoint, loading } = useInteractionDetails();
    const { Text } = Typography;
    const userId = 2;

    
    useEffect(() => {
        getInteractionsByCatchmentPoint(userId);
    }, []);


    if (loading || interactions.length === 0 ) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Spin size="large" />
            </div>
        );
    }

    function getFirstVoucherAndHora(interactions: any[]): {
    n_voucher: string;
    hora: string;
    flow: string;
    total: string;
    water_table: string;
    } {
    const found = interactions.find(item => item.n_voucher != null);
    if (!found) {
        return {
        n_voucher: 'Sin dato',
        hora: 'Sin dato',
        flow: 'Sin dato',
        total: 'Sin dato',
        water_table: 'Sin dato',
        };
    }
    return {
        n_voucher: found.n_voucher,
        hora: new Date(found.date_time_medition).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        flow: found.flow?.toString() ?? 'Sin dato',
        total: found.total?.toString() ?? 'Sin dato',
        water_table: found.water_table?.toString() ?? 'Sin dato',
    };
    }

    const { n_voucher, hora, flow, total, water_table } = getFirstVoucherAndHora(interactions);

    return (
        <Flex vertical={true} style={{ padding: 24 }}>
            <Flex justify="start" style={{ marginBottom: 32 }}>
                <Card style={{ width: '295px', marginRight: 16 }}>
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
                <Card style={{ width: '295px', marginRight: 16 }}>
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
                <Card style={{ width: '295px', marginRight: 16 }}>
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
                <Card style={{ width: '295px', marginRight: 16 }}>
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
            </Flex>
            <DgaAnalisisChart />
        </Flex>
    );
};

export default DGA_Analisis;