import React, { useEffect } from 'react';
import DgaAnalisisChart from '../../components/dga/DgaAnalisisChart';
import { Card, Flex, Spin, Typography } from 'antd';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';

interface Interaction {
    n_voucher: string | null;
    date_time_medition: string;
    flow: string | null;
    total: number | null;
    water_table: string | null;
    is_error?: boolean;
}

const DGA_Analisis: React.FC = () => {
    const { interactions, dailyInteractions, getInteractionsByCatchmentPoint, getInteractionDetailOverride, loading } = useInteractionDetails();
    const { Text } = Typography;
    const userId = 2;
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    useEffect(() => {
        getInteractionsByCatchmentPoint(userId);
    }, []);

    useEffect(() => {
        getInteractionDetailOverride(userId, month, (day-1).toString()+','+day.toString());
    }, []);


    if (loading || interactions.length === 0 || dailyInteractions.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Spin size="large" />
            </div>
        );
    }

    function getFirstVoucherAndHora(dailyInteractions: Interaction[]): {
        n_voucher: string;
        hora: string;
        flow: string;
        total: number | string;
        water_table: string;
        } {
        const found = dailyInteractions.find(item => item.n_voucher != null);
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

    const { n_voucher, hora, flow, total, water_table } = getFirstVoucherAndHora(dailyInteractions);

    function getVoucherStats(dailyInteractions: Interaction[]): {
        voucherWithData: number;
        voucherWithoutData: number;
        withError: number;
        } {
        let voucherWithData = 0;
        let voucherWithoutData = 0;
        let withError = 0;

        dailyInteractions.forEach(item => {
            if (item.n_voucher) {
            voucherWithData++;
            } else {
            voucherWithoutData++;
            }
            if (item.is_error === true) {
            withError++;
            }
        });

        return { voucherWithData, voucherWithoutData, withError };
    }

    const { voucherWithData, voucherWithoutData, withError } = getVoucherStats(dailyInteractions);


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
                            }}>{voucherWithData} Mediciones</Flex>
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
                            }}>{voucherWithoutData} Mediciones</Flex>
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
                            }}>{withError} Errores</Flex>
                    </Flex>
                </Card>
            </Flex>
            <DgaAnalisisChart />
        </Flex>
    );
};

export default DGA_Analisis;