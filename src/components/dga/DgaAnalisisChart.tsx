import { Line } from '@ant-design/plots';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import { useEffect, useState } from 'react';
import { Button, Flex, Spin, Typography } from 'antd';
import { useDgaConfigCatchment } from '../../hooks/useDgaConfigCatchment';


const DgaAnalisisChart: React.FC = () => {
    const { interactions, getInteractionsByCatchmentPoint, loading } = useInteractionDetails();
    const { getDgaConfigById, currentDgaConfig } = useDgaConfigCatchment();
    const userId = 2;
    const { Text } = Typography;
    const [dataType, setDataType] = useState<'acumulado' | 'caudal' | 'nivel'>('acumulado');

    useEffect(() => {
        getInteractionsByCatchmentPoint(userId);
    }, []);

    useEffect(() => {
        getDgaConfigById(userId);
      }, []);

    const threshold = Number(currentDgaConfig?.flow_granted_dga ?? 0);

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
        type: 'datos',
    }));

    const thresholdLine =
        dataType === 'caudal' && threshold
            ? data.map((d) => ({
                Hora: d.Hora,
                Valor: threshold,
                type: 'umbral',
            }))
            : [];

    const finalData = [...data, ...thresholdLine];


    const config = {
        data: finalData,
        xField: 'Hora',
        yField: 'Valor',
        seriesField: 'type',
        height: 350,
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
        color: (type: string) => {
        console.log('COLOR TYPE:', type);
        return type === 'umbral' ? 'red' : '#1890ff';
        },

        lineStyle: (type: string) =>
        type === 'umbral'
            ? { lineDash: [4, 4], lineWidth: 2 }
            : { lineWidth: 2 },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
    };

    if (loading || interactions.length === 0 || !currentDgaConfig) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Flex justify="start" vertical={true} style={{ width: '100%' }}>
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
            <Line key={dataType} {...config} />
        </Flex>
    );
};

export default DgaAnalisisChart;