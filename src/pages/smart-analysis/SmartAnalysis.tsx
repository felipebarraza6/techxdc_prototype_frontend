import { Button, Flex, Spin, Typography } from "antd";
import Chart from "../../components/smart-analysis/Chart";
import DateSelection from "../../components/smart-analysis/DateSelection";
import { useEffect, useState } from "react";
import "./SmartAnalysis.css";
import { useInteractionDetails } from "../../hooks/useInteractionDetails";
import Card from "antd/es/card/Card";
import { ClockCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, InfoCircleOutlined } from '@ant-design/icons';

type InteractionDataItem = {
    id: number;
    created: string;
    modified: string;
    date_time_medition: string;
    date_time_last_logger: string;
    days_not_conection: number;
    flow: string;
    pulses: number;
    total: number;
    total_diff: number;
    total_today_diff: number;
    nivel: string;
    water_table: string;
    send_dga: boolean;
    return_dga: string | null;
    n_voucher: string | null;
    is_error: boolean;
    catchment_point: number;
    notification: string | null;
};

const SmartAnalysis: React.FC = () => {
    const { Text } = Typography;
    const [activeButton, setActiveButton] = useState<string>("acumulado");
    const { getInteractionDetailOneDay, getInteractionDetailOneMonth } = useInteractionDetails();
    const userId = 2;
    type ChartValue = {
        titulo: string;
        subtitulo: string;
        nombreEjeX: string;
        nombreEjeY: string;
        valores: { x: string; y: number }[];
        umbral: number;
    };
    const [chartValues, setChartValues] = useState<ChartValue | undefined>(undefined);
    type CardData = {
        totalFirst: string;
        totalFirstTime: string;
        totalLast: string;
        totalLastTime: string;
        maxUsage: string;
        maxUsageTime: string;
        minUsage: string;
        minUsageTime: string;
        dailyConsumption: string;
        maxFlow: string;
        maxFlowTime: string;
        minFlow: string;
        minFlowTime: string;
        waterTableMax: string;
        waterTableMaxTime: string;
        waterTableMin: string;
        waterTableMinTime: string;
    }
    const [cardData, setCardData] = useState<CardData | undefined>(undefined);
    const [loading, setLoading] = useState(false);


    const getTodayDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // meses son 0-indexados
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [selectedDate, setSelectedDate] = useState<string | number>(getTodayDate());
    const esModoMensual = typeof selectedDate === "number";

    useEffect(() => {
        const today = getTodayDate();
        getDayData(today);
    }, []);


    const handleAnalyze = (value: string | number) => {
        setSelectedDate(value);
    };


    const getDayData = async (day: string) => {
        setLoading(true);
        const dayNumber = Number(day.split("-")[2]);
        const monthNumber = Number(day.split("-")[1]);
        const data = await getInteractionDetailOneDay(userId, monthNumber, dayNumber);

        if (data && data.length > 0) {
            procesarDatos(data, "Datos diarios", "Hora", getYLabelForButton(activeButton));
        } else {
            setChartValues(undefined);
        }
        setLoading(false);
    };

    const formatDateTime = (datetime: string): string => {
        const fecha = new Date(datetime);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}-${horas}:${minutos}`;
    };


    const monthAverage = (data: InteractionDataItem[], tipo: string): { x: string; y: number }[] => {
        const agrupado: { [key: string]: number[] } = {};

        data.forEach(item => {
            const fecha = item.date_time_medition.substring(0, 10); // "YYYY-MM-DD"
            let valor: number;

            switch (tipo) {
                case "acumulado":
                    valor = item.total / 1000;
                    break;
                case "consumoHora":
                    valor = item.total_diff / 1000;
                    break;
                case "consumoDia":
                    valor = item.total_today_diff / 1000;
                    break;
                case "caudal2":
                    valor = parseFloat(item.flow);
                    break;
                case "nivel":
                    valor = parseFloat(item.water_table);
                    break;
                default:
                    valor = 0;
            }

            if (!agrupado[fecha]) agrupado[fecha] = [];
            agrupado[fecha].push(valor);
        });

        return Object.entries(agrupado).map(([fecha, valores]) => {
            const promedio = valores.reduce((acc, val) => acc + val, 0) / valores.length;
            return { x: fecha, y: promedio };
        });
    };

    const getMonthData = async (month: number) => {
        setLoading(true);
        const data = await getInteractionDetailOneMonth(userId, month);

        if (data && data.length > 0) {
            const valores = monthAverage(data, activeButton);
            const sumaY = valores.reduce((acc, item) => acc + item.y, 0);
            const promedioY = valores.length > 0 ? sumaY / valores.length : 0;

            setChartValues({
                titulo: "Datos mensuales",
                subtitulo: "Estación Río Azul",
                nombreEjeX: "Día",
                nombreEjeY: getYLabelForButton(activeButton),
                valores,
                umbral: promedioY,
            });
            const consumo = getMinMaxDailyConsumption(data);
            const flujo = getMinMaxFlow(data);
            const nivel = getMinMaxWaterTable(data);

            setCardData({
                totalFirst: data[data.length - 1].total.toLocaleString('es-CL'),
                totalFirstTime: formatDateTime(data[data.length - 1].date_time_medition),
                totalLast: data[0].total.toLocaleString('es-CL'),
                totalLastTime: formatDateTime(data[0].date_time_medition),
                maxUsage: consumo.max.value,
                maxUsageTime: formatDateTime(consumo.max.date),
                minUsage: consumo.min.value,
                minUsageTime: formatDateTime(consumo.min.date),
                dailyConsumption: consumo.total.toLocaleString('es-CL'),
                maxFlow: flujo.max.value,
                maxFlowTime: formatDateTime(flujo.max.date),
                minFlow: flujo.min.value,
                minFlowTime: formatDateTime(flujo.min.date),
                waterTableMax: nivel.max.value,
                waterTableMaxTime: formatDateTime(nivel.max.date),
                waterTableMin: nivel.min.value,
                waterTableMinTime: formatDateTime(nivel.min.date),
            });
        } else {
            setChartValues(undefined);
        }
        setLoading(false);
    };

    const getMinMaxDailyConsumption = (data: InteractionDataItem[]) => {
        console.log(data);
        if (data.length === 0) {
            return {
                max: { value: '', date: '' },
                min: { value: '', date: '' },
                total: 0,
            };
        }

        let max = data[0];
        let min = data[0];
        let total = 0;

        for (const item of data) {
            total += item.total_today_diff;

            if (item.total_today_diff > max.total_today_diff) {
                max = item;
            }
            if (item.total_today_diff < min.total_today_diff) {
                min = item;
            }
        }

        return {
            max: {
                value: max.total_today_diff.toLocaleString('es-CL'),
                date: esModoMensual ? max.date_time_medition : max.date_time_medition.substring(11, 16),
            },
            min: {
                value: min.total_today_diff.toLocaleString('es-CL'),
                date: esModoMensual ? min.date_time_medition : min.date_time_medition.substring(11, 16),
            },
            total,
        };
    };

    const getMinMaxFlow = (data: InteractionDataItem[]) => {
        if (data.length === 0) {
            return {
                max: { value: '', date: '' },
                min: { value: '', date: '' },
            };
        }

        let max = data[0];
        let min = data[0];

        for (const item of data) {
            const currentValue = parseFloat(item.flow);
            const maxValue = parseFloat(max.flow);
            const minValue = parseFloat(min.flow);

            if (currentValue > maxValue) {
                max = item;
            }
            if (currentValue < minValue) {
                min = item;
            }
        }

        return {
            max: {
                value: parseFloat(max.flow).toLocaleString('es-CL'),
                date: esModoMensual ? max.date_time_medition : max.date_time_medition.substring(11, 16),
            },
            min: {
                value: parseFloat(min.flow).toLocaleString('es-CL'),
                date: esModoMensual ? min.date_time_medition : min.date_time_medition.substring(11, 16),
            },
        };
    };

    const getMinMaxWaterTable = (data: InteractionDataItem[]) => {
        if (data.length === 0) {
            return {
                max: { value: '', date: '' },
                min: { value: '', date: '' },
            };
        }

        let max = data[0];
        let min = data[0];

        for (const item of data) {
            const currentValue = parseFloat(item.water_table);
            const maxValue = parseFloat(max.water_table);
            const minValue = parseFloat(min.water_table);

            if (currentValue > maxValue) {
                max = item;
            }
            if (currentValue < minValue) {
                min = item;
            }
        }

        return {
            max: {
                value: parseFloat(max.water_table).toLocaleString('es-CL'),
                date: esModoMensual? max.date_time_medition : max.date_time_medition.substring(11, 16),
            },
            min: {
                value: parseFloat(min.water_table).toLocaleString('es-CL'),
                date: esModoMensual? min.date_time_medition : min.date_time_medition.substring(11, 16),
            },
        };
    };


    const procesarDatos = (
        data: InteractionDataItem[],
        titulo: string,
        nombreEjeX: string,
        nombreEjeY: string
    ) => {
        if (data && data.length > 0) {
            let valores: { x: string; y: number }[] = [];
            let chartTitle = "";
            let chartSubTitle = "";

            switch (activeButton) {
                case "acumulado":
                valores = data.map(item => ({
                    x: modoDatos(nombreEjeX, item.date_time_medition),
                    y: item.total,
                }));
                chartTitle = "Acumulado (m³)";
                chartSubTitle = "Comportamiento durante las últimas 24 horas";
                break;
                case "consumoHora":
                valores = data.map(item => ({
                    x: modoDatos(nombreEjeX, item.date_time_medition),
                    y: item.total_diff,
                }));
                chartTitle = "Consumo por hora (m³/h)";
                chartSubTitle = "";
                break;
                case "consumoDia":
                valores = data.map(item => ({
                    x: modoDatos(nombreEjeX, item.date_time_medition),
                    y: item.total_today_diff,
                }));
                chartTitle = "Consumo día (m³)";
                chartSubTitle = "";
                break;
                case "caudal2":
                valores = data.map(item => ({
                    x: modoDatos(nombreEjeX, item.date_time_medition),
                    y: parseFloat(item.flow),
                }));
                chartTitle = "Caudal (lt/s)";
                chartSubTitle = "";
                break;
                case "nivel":
                valores = data.map(item => ({
                    x: modoDatos(nombreEjeX, item.date_time_medition),
                    y: parseFloat(item.water_table),
                }));
                chartTitle = "Nivel freático(m)";
                chartSubTitle = "";
                break;
                default:
                valores = [];
            }

            const sumaY = valores.reduce((acc, item) => acc + item.y, 0);
            const promedioY = valores.length > 0 ? sumaY / valores.length : 0;

            setChartValues({
                titulo: chartTitle,
                subtitulo: chartSubTitle,
                nombreEjeX,
                nombreEjeY,
                valores,
                umbral: promedioY,
            });

            setCardData({
                totalFirst: data[data.length-1].total.toLocaleString('es-CL'),
                totalFirstTime: data[data.length-1].date_time_medition.substring(11, 16),
                totalLast: data[0].total.toLocaleString('es-CL'),
                totalLastTime: data[0].date_time_medition.substring(11, 16),
                maxUsage: getMinMaxDailyConsumption(data)?.max.value ?? '',
                maxUsageTime: getMinMaxDailyConsumption(data)?.max.date ?? '',
                minUsage: getMinMaxDailyConsumption(data)?.min.value ?? '',
                minUsageTime: getMinMaxDailyConsumption(data)?.min.date ?? '',
                dailyConsumption: getMinMaxDailyConsumption(data)?.total?.toLocaleString('es-CL') ?? '',
                maxFlow: getMinMaxFlow(data)?.max.value ?? '',
                maxFlowTime: getMinMaxFlow(data)?.max.date ?? '',
                minFlow: getMinMaxFlow(data)?.min.value ?? '',
                minFlowTime: getMinMaxFlow(data)?.min.date ?? '',
                waterTableMax: getMinMaxWaterTable(data)?.max.value ?? '',
                waterTableMaxTime: getMinMaxWaterTable(data)?.max.date ?? '',
                waterTableMin: getMinMaxWaterTable(data)?.min.value ?? '',
                waterTableMinTime: getMinMaxWaterTable(data)?.min.date ?? '',
            })
        } else {
        setChartValues(undefined);
        }
    };

    const modoDatos = (nombreEjeX: string, datetime: string) => {
        if (nombreEjeX === "Hora") {
        return datetime.substring(11, 16);
        } else if (nombreEjeX === "Día") {
        return datetime.substring(8, 10);
        }
        return datetime;
    };

    const getYLabelForButton = (buttonId: string): string => {
        switch (buttonId) {
            case "acumulado":
                return "Acumulado (m³)";
            case "consumoHora":
                return "Consumo por hora (m³/h)";
            case "consumoDia":
                return "Consumo diario acumulado (m³)";
            case "caudal2":
                return "Caudal (lt/s)";
            case "nivel":
                return "Nivel freático (m)";
            default:
                return "Valor";
        }
    };

    useEffect(() => {
        if (typeof selectedDate === "string") {
            getDayData(selectedDate);
        } else if (typeof selectedDate === "number") {
            getMonthData(selectedDate);
        }
    }, [activeButton, selectedDate]);

    const handleClick = (buttonId: string) => {
        setActiveButton(buttonId);
    };

    const buttons = [
        { id: 'acumulado', labelLeft: 'Acumulado', labelRight: 'm³' },
        { id: 'consumoHora', labelLeft: 'Consumo hora', labelRight: 'm³/h' },
        { id: 'consumoDia', labelLeft: 'Consumo día', labelRight: 'm³/d' },
        { id: 'caudal2', labelLeft: 'Caudal', labelRight: 'lt/s' },
        { id: 'nivel', labelLeft: 'Nivel freático', labelRight: 'm' },
        { id: 'datos', labelLeft: 'Datos' },
    ];

    const buttonStyle = {
        border: "none",
        boxShadow: "none",
        outline: "none",
        marginRight: 8
    };

   
    return (
        <Flex style={{ width: '100%' }} justify="start" vertical={true}>
            <DateSelection onDateSelected={handleAnalyze}/>
            <Flex justify="start" wrap="wrap" style={{ width: '100%', margin: '40px 0' }}>
                {buttons.map(({ id, labelLeft, labelRight }) => (
                    <Button
                        key={id}
                        size="large"
                        style={buttonStyle}
                        className={activeButton === id ? 'active-button' : 'inactive-button'}
                        onClick={() => handleClick(id)}
                    >
                        <Text className={activeButton === id ? 'left-text-active' : 'left-text-inactive'}>
                            {labelLeft}
                        </Text>
                        {labelRight && (
                            <Text className={activeButton === id ? 'right-text-active' : 'right-text-inactive'}>
                            {labelRight}
                            </Text>
                        )}
                    </Button>
                ))}
            </Flex>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Spin size="large" />
                </div>
            ) : chartValues ? (
                <Chart 
                    titulo={chartValues.titulo}
                    subtitulo={chartValues.subtitulo}
                    nombreEjeX={chartValues.nombreEjeX}
                    nombreEjeY={chartValues.nombreEjeY}
                    valores={chartValues.valores}
                    umbral={chartValues.umbral}
                />
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay datos disponibles
                </div>
            )}
            <Flex justify="start" wrap="wrap" gap={16}  style={{ marginTop: 32 }}>
                <Card style={{ width: '240px', marginRight: 16 }}>
                    <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>Resumen acumulado</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 4 }}>{esModoMensual ? 'Primer y último registro del mes' : 'Primer y último registro del día'}</Text>
                    </Flex>
                    <Flex align="center" vertical={true} style={{ width: '100%', borderTop: '1px solid #e8e8e8'}}>
                        <Flex justify="space-between" style={{width: '100%', marginTop: 10}}>
                            <Flex>
                                <ClockCircleOutlined style={{marginRight: 5}}/>
                                <Text style= {{color:'#64748B', fontWeight: 'normal', fontSize: '14px'}}>{cardData?.totalFirstTime} hrs.</Text>
                            </Flex>
                            <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>{cardData?.totalFirst} m³</Text>
                        </Flex>
                        <Flex justify="space-between" style={{width: '100%', marginTop: 5}}>
                            <Flex>
                                <ClockCircleOutlined style={{marginRight: 5}}/>
                                <Text style= {{color:'#64748B', fontWeight: 'normal', fontSize: '14px'}}>{cardData?.totalLastTime} hrs.</Text>
                            </Flex>
                            <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>{cardData?.totalLast} m³</Text>
                        </Flex>
                    </Flex>
                </Card>

                <Card style={{ width: '240px', marginRight: 16 }}>
                    <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>Consumos MAX/MIN</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 4 }}>{esModoMensual ? 'Consumos MAX/MIN del mes' : 'Consumos MAX/MIN del día'}</Text>
                    </Flex>
                    <Flex align="center" vertical={true} style={{ width: '100%', borderTop: '1px solid #e8e8e8'}}>
                        <Flex justify="space-between" style={{width: '100%', marginTop: 10}}>
                            <Flex>
                                <ArrowRightOutlined style={{marginRight: 5, color: 'green'}}/>
                                <Text style= {{color:'#64748B', fontWeight: 'normal', fontSize: '14px'}}>{cardData?.maxUsageTime} hrs.</Text>
                            </Flex>
                            <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>{cardData?.maxUsage} m³/h</Text>
                        </Flex>
                        <Flex justify="space-between" style={{width: '100%', marginTop: 5}}>
                            <Flex>
                                <ArrowLeftOutlined style={{marginRight: 5, color: 'red'}}/>
                                <Text style= {{color:'#64748B', fontWeight: 'normal', fontSize: '14px'}}>{cardData?.minUsageTime} hrs.</Text>
                            </Flex>
                            <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>{cardData?.minUsage} m³/h</Text>
                        </Flex>
                    </Flex>
                </Card>

                <Card style={{ width: '240px', marginRight: 16 }}>
                    <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>{esModoMensual ? 'Consumo del mes' : 'Consumo del día'}</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 4 }}>Consumo registrado</Text>
                    </Flex>
                    <Flex align="center" vertical={true} style={{ width: '100%', borderTop: '1px solid #e8e8e8'}}>
                        <Text style= {{ fontWeight: 'bold', fontSize: '24px'}}>{cardData?.dailyConsumption} m³</Text>
                    </Flex>
                </Card>

                <Card style={{ width: '240px', marginRight: 16 }}>
                    <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>Caudal MAX/MIN</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 4 }}>Registro máximo y mínimo{esModoMensual ? ' del mes' : ' del día'}</Text>
                    </Flex>
                    <Flex align="center" vertical={true} style={{ width: '100%', borderTop: '1px solid #e8e8e8'}}>
                        <Flex justify="space-between" style={{width: '100%', marginTop: 10}}>
                            <Flex>
                                <ClockCircleOutlined style={{marginRight: 5}}/>
                                <Text style= {{color:'#64748B', fontWeight: 'normal', fontSize: '14px'}}>{cardData?.maxFlowTime} hrs.</Text>
                            </Flex>
                            <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>{cardData?.maxFlow} lts/s</Text>
                        </Flex>
                        <Flex justify="space-between" style={{width: '100%', marginTop: 5}}>
                            <Flex>
                                <ClockCircleOutlined style={{marginRight: 5}}/>
                                <Text style= {{color:'#64748B', fontWeight: 'normal', fontSize: '14px'}}>{cardData?.minFlowTime} hrs.</Text>
                            </Flex>
                            <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>{cardData?.minFlow} lts/s</Text>
                        </Flex>
                    </Flex>
                </Card>

                <Card style={{ width: '240px', marginRight: 16 }}>
                    <Flex justify="start" vertical={true} style={{ width: '100%' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>Nivel freático MAX/MIN</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 4 }}>Registro máximo y mínimo{esModoMensual ? ' del mes' : ' del día'}</Text>
                    </Flex>
                    <Flex align="center" vertical={true} style={{ width: '100%', borderTop: '1px solid #e8e8e8'}}>
                        <Flex justify="space-between" style={{width: '100%', marginTop: 10}}>
                            <Flex>
                                <InfoCircleOutlined style={{marginRight: 5}}/>
                                <Text style= {{color:'#64748B', fontWeight: 'normal', fontSize: '14px'}}>{cardData?.waterTableMaxTime} hrs.</Text>
                            </Flex>
                            <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>{cardData?.waterTableMax} m</Text>
                        </Flex>
                        <Flex justify="space-between" style={{width: '100%', marginTop: 5}}>
                            <Flex>
                                <InfoCircleOutlined style={{marginRight: 5}}/>
                                <Text style= {{color:'#64748B', fontWeight: 'normal', fontSize: '14px'}}>{cardData?.waterTableMinTime} hrs.</Text>
                            </Flex>
                            <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>{cardData?.waterTableMin} m</Text>
                        </Flex>
                    </Flex>
                </Card>

            </Flex>

        </Flex>
    );
};

export default SmartAnalysis;
