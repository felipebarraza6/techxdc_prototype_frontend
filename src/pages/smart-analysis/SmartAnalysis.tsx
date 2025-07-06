import { Button, Flex, Spin, Typography } from "antd";
import Chart from "../../components/smart-analysis/Chart";
import DateSelection from "../../components/smart-analysis/DateSelection";
import { useEffect, useState } from "react";
import "./SmartAnalysis.css";
import { useInteractionDetails } from "../../hooks/useInteractionDetails";

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
    const [loading, setLoading] = useState(false);


    const getTodayDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // meses son 0-indexados
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [selectedDate, setSelectedDate] = useState<string | number>(getTodayDate());

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
        } else {
            setChartValues(undefined);
        }

        setLoading(false);
    };

    const procesarDatos = (
        data: InteractionDataItem[],
        titulo: string,
        nombreEjeX: string,
        nombreEjeY: string
    ) => {
        if (data && data.length > 0) {
        let valores: { x: string; y: number }[] = [];

        switch (activeButton) {
            case "acumulado":
            valores = data.map(item => ({
                x: modoDatos(nombreEjeX, item.date_time_medition),
                y: item.total / 1000,
            }));
            break;
            case "consumoHora":
            valores = data.map(item => ({
                x: modoDatos(nombreEjeX, item.date_time_medition),
                y: item.total_diff / 1000,
            }));
            break;
            case "consumoDia":
            valores = data.map(item => ({
                x: modoDatos(nombreEjeX, item.date_time_medition),
                y: item.total_today_diff / 1000,
            }));
            break;
            case "caudal2":
            valores = data.map(item => ({
                x: modoDatos(nombreEjeX, item.date_time_medition),
                y: parseFloat(item.flow),
            }));
            break;
            case "nivel":
            valores = data.map(item => ({
                x: modoDatos(nombreEjeX, item.date_time_medition),
                y: parseFloat(item.water_table),
            }));
            break;
            default:
            valores = [];
        }

        const sumaY = valores.reduce((acc, item) => acc + item.y, 0);
        const promedioY = valores.length > 0 ? sumaY / valores.length : 0;

        setChartValues({
            titulo,
            subtitulo: "Estación Río Azul",
            nombreEjeX,
            nombreEjeY,
            valores,
            umbral: promedioY,
        });
        } else {
        setChartValues(undefined);
        }
    };

    const modoDatos = (nombreEjeX: string, datetime: string) => {
        if (nombreEjeX === "Hora") {
        return datetime.substring(11, 16); // hh:mm
        } else if (nombreEjeX === "Día") {
        return datetime.substring(8, 10); // día del mes
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
        { id: 'caudal1', labelLeft: 'Caudal', labelRight: 'm³' },
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

        </Flex>
    );
};

export default SmartAnalysis;
