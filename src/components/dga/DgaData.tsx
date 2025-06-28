import React, { useEffect } from 'react';
import { Table, Spin, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDgaConfigCatchment } from '../../hooks/useDgaConfigCatchment';
import './DgaData.css';

interface RowData {
  key: string;
  label: string;
  value: string | number | null;
}

const DgaData: React.FC = () => {
  const { loading, error, getDgaConfigById, currentDgaConfig } = useDgaConfigCatchment();

  useEffect(() => {
    getDgaConfigById(9);
  }, []);

  useEffect(() => {
    console.log(currentDgaConfig)
  }, [currentDgaConfig]);

  if (loading) {
    return (
      <Spin tip="Cargando...">
        <div />
      </Spin>
    );
  }

  if (error) {
    return <Alert message="Error al obtener la configuración DGA" type="error" />;
  }

  if (!currentDgaConfig) return null;

  const percentUsage =
  currentDgaConfig.flow_granted_dga && currentDgaConfig.total_granted_dga
    ? (Number(currentDgaConfig.flow_granted_dga) / Number(currentDgaConfig.total_granted_dga)) * 100
    : null;

  const rows: RowData[] = [
    { key: 'code_dga', label: 'Código de obra', value: currentDgaConfig.code_dga },
    { key: 'standard', label: 'Estándar', value: currentDgaConfig.standard },
    { key: 'created', label: 'Creado', value: currentDgaConfig.created },
    { key: 'type_dga', label: 'Tipo de captación', value: currentDgaConfig.type_dga },
    { key: 'flow_granted_dga', label: 'Caudal autorizado', value: currentDgaConfig.flow_granted_dga },
    { key: 'percentUsage', label: '% Caudal en uso', value: '--'},
    { key: 'total_granted_dga', label: 'Total autorizado', value: currentDgaConfig.total_granted_dga },
    { key: 'percentTotal', label: '% Total autorizado', value: percentUsage !== null ? `${percentUsage.toFixed(2)}%` : '—' },
    { key: 'shac', label: 'SHAC', value: currentDgaConfig.shac },
    { key: 'date_start_compliance', label: 'Fecha inicio cumplimiento', value: currentDgaConfig.date_start_compliance },


    // { key: 'modified', label: 'Modificado', value: currentDgaConfig.modified },
    // { key: 'send_dga', label: '¿Enviado a DGA?', value: currentDgaConfig.send_dga ? 'Sí' : 'No' },
    // { key: 'date_created_code', label: 'Fecha creación código', value: currentDgaConfig.date_created_code },
    // { key: 'name_informant', label: 'Informante', value: currentDgaConfig.name_informant },
    // { key: 'rut_report_dga', label: 'RUT reportante', value: currentDgaConfig.rut_report_dga },
    // { key: 'password_dga_software', label: 'Contraseña software', value: currentDgaConfig.password_dga_software },
    // { key: 'point_catchment', label: 'Punto de captación', value: currentDgaConfig.point_catchment },
    // { key: 'id', label: 'ID', value: currentDgaConfig.id },
  ];

  const columns: ColumnsType<RowData> = [
    {
      title: '',
      dataIndex: 'label',
      key: 'label',
      width: '40%',
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
      width: '60%',
      align: 'right',
    },
  ];

  return (
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        showHeader={false}
        rowClassName={(_, index) => (index % 2 === 0 ? 'row-color' : '')}
        bordered
      />
  );
};

export default DgaData;
