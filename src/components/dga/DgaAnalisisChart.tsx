import { Line } from '@ant-design/plots';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import { useEffect, useState } from 'react';
import { Button, Flex, Spin, Typography, Alert } from 'antd';
import { useDgaConfigCatchment } from '../../hooks/useDgaConfigCatchment';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const DgaAnalisisChart: React.FC = () => {
    const { interactions, getInteractionsByCatchmentPoint, loading } = useInteractionDetails();
    const { getDgaConfigById, currentDgaConfig } = useDgaConfigCatchment();
    const { selectedCatchmentPoint } = useSelectedCatchmentPoint();
    const { Text } = Typography;
    const [dataType, setDataType] = useState<'acumulado' | 'caudal' | 'nivel'>('acumulado');
    const { isMobile } = useBreakpoint();
    const [loadingTimeout, setLoadingTimeout] = useState(false);

    useEffect(() => {
        if (selectedCatchmentPoint) {
            getInteractionsByCatchmentPoint(selectedCatchmentPoint.id);
            getDgaConfigById(selectedCatchmentPoint.id);
        }
    }, [selectedCatchmentPoint, getInteractionsByCatchmentPoint, getDgaConfigById]);

    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => setLoadingTimeout(true), 10000);
            return () => clearTimeout(timer);
        } else {
            setLoadingTimeout(false);
        }
    }, [loading]);

    const data = interactions.map((item) => ({
        Hora: new Date(item.date_time_medition).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        Valor:
            dataType === 'acumulado'
                ? Number(item.total)
                : dataType === 'caudal'
                ? Number(item.flow)
                : dataType === 'nivel'
                ? Number(item.water_table)
                : 0,
    }));

    const config = {
        data,
        xField: 'Hora',
        yField: 'Valor',
        autoFit: true,
        height: isMobile ? 220 : 350,
        xAxis: {
            title: { text: 'Hora', style: { fontWeight: 600 } },
        },
        yAxis: {
            title: {
                text:
                    dataType === 'acumulado'
                        ? 'Acumulado (m3)'
                        : dataType === 'caudal'
                        ? 'Caudal (l/s)'
                        : dataType === 'nivel'
                        ? 'Nivel freático (m)'
                        : '',
                style: { fontWeight: 600 },
            },
            label: {
                formatter: (v: string) => Number(v).toLocaleString('es-CL'),
            },
        },
        point: {
            shapeField: 'circle',
            sizeField: 4,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        },
    };

    if (loadingTimeout) {
        return (
            <div style={{ marginTop: 24 }}>
                <Alert
                    message="No se pudo obtener datos de mediciones. Intenta nuevamente o selecciona otro punto."
                    type="warning"
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

    if (!currentDgaConfig) {
        return (
            <div style={{ marginTop: 24 }}>
                <Alert
                    message="No hay configuración DGA disponible para este punto de captación."
                    type="info"
                    showIcon
                    style={{ fontSize: 16 }}
                />
            </div>
        );
    }

    return (
        <div style={{ width: '100%', maxWidth: '100vw' }}>
            <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Autorizado</Text>
                <Text style={{ fontSize: 12, fontWeight: 'light', marginBottom: 8 }}>
                    Estás utilizando {(interactions[0]?.total ?? 0).toLocaleString('es-CL')} m³ / 
                    {(currentDgaConfig?.total_granted_dga ?? 0).toLocaleString('es-CL')} m3 
                    ({(((interactions[0]?.total ?? 0) / (currentDgaConfig?.total_granted_dga ?? 0)) * 100).toLocaleString('es-CL', { maximumFractionDigits: 2 })}%) de tu consumo autorizado.
                </Text>
                <Flex justify="start" style={{ width: '100%' }}>
                    <Button
                        style={{
                            fontSize: 12,
                            marginBottom: 16,
                            marginRight: 8,
                            background: dataType === 'acumulado' ? '#568E2B' : '#425176',
                            color: '#fff',
                            border: 'none',
                            outline: 'none', 
                        }}
                        onClick={() => setDataType('acumulado')}
                    >
                        Acumulado
                    </Button>
                    <Button
                        style={{
                            fontSize: 12,
                            marginBottom: 16,
                            marginRight: 8,
                            background: dataType === 'caudal' ? '#568E2B' : '#425176',
                            color: '#fff',
                            border: 'none',
                            outline: 'none', 
                        }}
                        onClick={() => setDataType('caudal')}
                    >
                        Caudal
                    </Button>
                    <Button
                        style={{
                            fontSize: 12,
                            marginBottom: 16,
                            marginRight: 8,
                            background: dataType === 'nivel' ? '#568E2B' : '#425176',
                            color: '#fff',
                            border: 'none',
                            outline: 'none', 
                        }}
                        onClick={() => setDataType('nivel')}
                    >
                        Nivel freático
                    </Button>
                </Flex>
            </Flex>
            <div style={{ width: '100%' }}>
                <Line {...config} />
            </div>
        </div>
    );
};

export default DgaAnalisisChart;