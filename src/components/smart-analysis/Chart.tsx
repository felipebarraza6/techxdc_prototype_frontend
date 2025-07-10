import { Line } from "@ant-design/charts";
import React from "react";
import { Flex, Typography } from "antd";

interface DataPoint {
    x: string;
    y: number;
}

interface Props {
    titulo: string;
    subtitulo: string;
    nombreEjeX: string;
    nombreEjeY: string;
    valores: DataPoint[];
    umbral?: number;
    height?: number;
}

const Chart: React.FC<Props> = ({ titulo, subtitulo, nombreEjeX, nombreEjeY, valores, umbral, height }) => {
  
    const { Text } = Typography;

    const data = valores.map((item) => ({
        Hora: item.x,
        Valor: item.y,
        type: "datos",
    }));

    const thresholdLine = umbral
        ? valores.map((item) => ({
            Hora: item.x,
            Valor: umbral,
            type: "umbral",
        }))
        : [];

  const finalData = [...data, ...thresholdLine];

    const config = {
        data: finalData,
        xField: "Hora",
        yField: "Valor",
        seriesField: "type",
        height: height || 350,
        xAxis: {
            title: { text: nombreEjeX, style: { fontWeight: 600, color: '#1C355F' } },
        },
        yAxis: {
            title: {
            text: nombreEjeY,
            style: { fontWeight: 600, color: '#1C355F' },
            },
            label: {
            formatter: (v: string) => Number(v).toLocaleString("es-CL"),
            },
        },
        point: {
            shapeField: "circle",
            size: 4,
        },
        color: ({ type }: { type: string }) => (type === "umbral" ? "red" : "#1890ff"),
        lineStyle: ({ type }: { type: string }) =>
        type === "umbral"
            ? { lineDash: [4, 4], stroke: "red", lineWidth: 2 }
            : { lineWidth: 2 },

        legend: {
            position: 'top-left',
            itemName: {
                formatter: (val: string) => val === 'umbral' ? 'Promedio' : 'Datos',
            },
        },
        tooltip: {
            showMarkers: false,
        },
    };


  return (
    <Flex justify="start" vertical={true} style={{ width: "100%", border: "1px solid #e8e8e8", borderRadius: 20, padding: 24, }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8, color: '#1C355F' }}>
            {titulo}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: "light", marginBottom: 8, color: '#1C355F' }}>
            {subtitulo}
        </Text>
        <Line {...config} />
    </Flex>
  );
};

export default Chart;
