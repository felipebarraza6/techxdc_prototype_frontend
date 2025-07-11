import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Grid, DatePicker, ConfigProvider, Spin, Alert, Modal, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';
import { useInteractionDetails } from '../../hooks/useInteractionDetails';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import esES from 'antd/locale/es_ES';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import logoEmpresa from '../../assets/img/logoempresa.png';
dayjs.locale('es');

const Reportes: React.FC = () => {
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const screens = Grid.useBreakpoint();
  const { selectedCatchmentPoint } = useSelectedCatchmentPoint();
  const { getInteractionDetailOneMonth, dailyInteractions, loading, error } = useInteractionDetails();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  // Definir columns aquí para acceder a los setters de estado
  const columns = [
    { title: <span style={{ color: '#1C355F', fontWeight: 600 }}>Fecha</span>, dataIndex: 'fecha', key: 'fecha', align: 'center' as const },
    { title: <span style={{ color: '#1C355F', fontWeight: 600 }}>Caudal</span>, dataIndex: 'caudal', key: 'caudal', align: 'center' as const },
    { title: <span style={{ color: '#1C355F', fontWeight: 600 }}>Acumulado</span>, dataIndex: 'acumulado', key: 'acumulado', align: 'center' as const },
    { title: <span style={{ color: '#1C355F', fontWeight: 600 }}>Acumulado /hora (m³)</span>, dataIndex: 'acumuladoHora', key: 'acumuladoHora', align: 'center' as const },
    { title: <span style={{ color: '#1C355F', fontWeight: 600 }}>Contador diario (m³)</span>, dataIndex: 'contadorDiario', key: 'contadorDiario', align: 'center' as const },
    { title: <span style={{ color: '#1C355F', fontWeight: 600 }}>Nivel Freatico (m)</span>, dataIndex: 'nivelFreatico', key: 'nivelFreatico', align: 'center' as const },
    {
      title: '',
      key: 'action',
      align: 'center' as const,
      render: (_: any, row: any) => (
        <EyeOutlined
          style={{ color: '#90a4ae', fontSize: 18, cursor: 'pointer' }}
          onClick={() => handleEyeClick(row)}
        />
      ),
      width: 40,
    },
  ];

  // Al hacer clic en el ojo, buscar el objeto original de la medición
  const handleEyeClick = (row: any) => {
    const original = dailyInteractions.find(item =>
      dayjs(item.date_time_medition).format('DD/MM/YYYY') === row.fecha
    );
    setSelectedRow(original || row);
    setModalOpen(true);
  };

  // Lógica para obtener datos reales al cambiar pozo o fechas
  useEffect(() => {
    if (
      selectedCatchmentPoint &&
      Array.isArray(dateRange) &&
      dateRange[0] &&
      dateRange[1] &&
      !isNaN(dateRange[0].date()) &&
      !isNaN(dateRange[1].date())
    ) {
      const month = dateRange[0].month() + 1; // dayjs: 0-indexed
      getInteractionDetailOneMonth(selectedCatchmentPoint.id, month);
    }
  }, [selectedCatchmentPoint, dateRange, getInteractionDetailOneMonth]);

  // Filtrar los datos del mes por el rango de días seleccionado
  const tableData = dailyInteractions
    .filter(item => {
      if (!Array.isArray(dateRange) || !dateRange[0] || !dateRange[1]) return true;
      const day = dayjs(item.date_time_medition).date();
      return day >= dateRange[0].date() && day <= dateRange[1].date();
    })
    .map((item, idx) => ({
      key: idx,
      fecha: dayjs(item.date_time_medition).format('DD/MM/YYYY'),
      caudal: item.flow,
      acumulado: item.total,
      acumuladoHora: item.total_diff,
      contadorDiario: item.total_today_diff,
      nivelFreatico: item.water_table,
    }));

  // Paginación manual: mostrar solo 10 filas por página
  const pageSize = 10;
  const paginatedData = tableData.slice((page - 1) * pageSize, page * pageSize);

  // Función para generar el Excel enriquecido (con logo y datos extra)
  const generateExcel = () => {
    // Datos para exportar (toda la tabla filtrada + extras del modal)
    const exportData = tableData.map(row => {
      const original = dailyInteractions.find(item =>
        dayjs(item.date_time_medition).format('DD/MM/YYYY') === row.fecha
      );
      return {
        Fecha: String(row.fecha),
        Caudal: String(row.caudal),
        Acumulado: String(row.acumulado),
        'Acumulado /hora (m³)': String(row.acumuladoHora),
        'Contador diario (m³)': String(row.contadorDiario),
        'Nivel Freatico (m)': String(row.nivelFreatico),
        Pulsos: original ? String(original.pulses) : '',
        'Enviado a DGA': original ? (original.send_dga ? 'Sí' : 'No') : '',
        'Creado': original ? String(original.created) : '',
        'Modificado': original ? String(original.modified) : '',
      };
    });

    // Agregar resumen al final
    const sumaCaudal = exportData.reduce((acc, row) => acc + Number(row.Caudal), 0);
    const promedioNivel = exportData.length > 0 ? (exportData.reduce((acc, row) => acc + Number(row['Nivel Freatico (m)']), 0) / exportData.length).toFixed(2) : 0;
    exportData.push({
      Fecha: 'RESUMEN',
      Caudal: String(sumaCaudal),
      Acumulado: '',
      'Acumulado /hora (m³)': '',
      'Contador diario (m³)': '',
      'Nivel Freatico (m)': String(promedioNivel),
      Pulsos: '',
      'Enviado a DGA': '',
      'Creado': '',
      'Modificado': '',
    });

    // Crear hoja y libro
    const ws = XLSX.utils.json_to_sheet(exportData);
    // Eliminar filas de título, empresa y logo (no agregar sheet_add_aoa)
    // Filtros automáticos
    ws['!autofilter'] = { ref: 'A1:I1' };
    // Congelar la primera fila de datos
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Generar archivo y blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/octet-stream' });
  };

  // Función para descargar Excel
  const exportToExcel = () => {
    const blob = generateExcel();
    saveAs(blob, 'reporte_mediciones.xlsx');
  };

  // Función para previsualizar Excel en modal
  const previewExcel = () => {
    setExcelModalOpen(true);
  };

  return (
    <ConfigProvider locale={esES}>
      <div style={{ background: '#fafbfc', minHeight: '100vh', width: '100%' }}>
        <Row gutter={[24, 24]} wrap style={{ width: '100%', margin: 0 }}>
          <Col xs={24} md={14} style={{ width: '100%' }}>
            {/* Título y subtítulo de referencia */}
            <div style={{ marginTop: 24, marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: '#1C355F', fontWeight: 700, fontSize: 20 }}>
                Filtra los reportes por rango de fechas
              </h3>
              <div style={{ color: '#64748B', fontSize: 15, marginTop: 2 }}>
                Selecciona un periodo para ver los datos históricos del pozo seleccionado.
              </div>
            </div>
            {/* Calendario de rango de fechas */}
            <div style={{ marginBottom: 24, marginTop: 16 }}>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(values) => setDateRange(values as [Dayjs | null, Dayjs | null])}
                format="DD/MM/YYYY"
                style={{ width: screens.xs ? '100%' : 320 }}
                allowClear
                disabled={!selectedCatchmentPoint}
              />
            </div>
            {/* Tabla de reportes */}
            <Card style={{ padding: 0 }} bodyStyle={{ padding: screens.xs ? 4 : 0 }}>
              {!selectedCatchmentPoint ? (
                <Alert type="info" message="Seleccione un pozo para visualizar los reportes." showIcon style={{ margin: 16 }} />
              ) : !dateRange || !dateRange[0] || !dateRange[1] ? (
                <Alert type="info" message="Seleccione un rango de fechas para consultar los datos históricos." showIcon style={{ margin: 16 }} />
              ) : loading ? (
                <Spin style={{ display: 'block', margin: '40px auto' }} />
              ) : error ? (
                <Alert type="error" message="Error al cargar datos" description={String(error)} showIcon style={{ margin: 16 }} />
              ) : tableData.length === 0 ? (
                <Alert type="info" message="No hay datos para mostrar en este periodo." showIcon style={{ margin: 16 }} />
              ) : (
                <Table
                  columns={columns.map(col =>
                    col.key !== 'action'
                      ? { ...col, render: (text: string) => <span style={{ color: '#1C355F', fontSize: screens.xs ? 11 : 14, wordBreak: 'break-word' }}>{text}</span> }
                      : col
                  )}
                  dataSource={paginatedData}
                  pagination={false}
                  bordered={false}
                  size="small"
                  style={{ borderRadius: 8, fontSize: screens.xs ? 11 : 16, width: '100%' }}
                  components={{
                    body: {
                      cell: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
                        <td {...props} style={{ ...props.style, paddingTop: screens.xs ? 4 : 12, paddingBottom: screens.xs ? 4 : 12, fontSize: screens.xs ? 11 : 14, wordBreak: 'break-word' }} />
                      ),
                    },
                    header: {
                      cell: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
                        <th {...props} style={{ ...props.style, paddingTop: screens.xs ? 4 : 12, paddingBottom: screens.xs ? 4 : 12, fontSize: screens.xs ? 11 : 14, wordBreak: 'break-word' }} />
                      ),
                    },
                  }}
                />
              )}
              {/* Paginación custom (igual que antes) */}
              <div style={{ display: 'flex', justifyContent: screens.xs ? 'center' : 'flex-end', padding: screens.xs ? '12px 0 0 0' : 16, marginTop: screens.xs ? 8 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: '1.5px solid #D9D9D9',
                      background: '#fff',
                      color: '#1C355F',
                      fontWeight: 500,
                      fontSize: 16,
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    {'<'}
                  </button>
                  {Array.from({ length: Math.ceil(tableData.length / pageSize) }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: '50%',
                        border: '1.5px solid #5C88C9',
                        background: page === num ? '#fff' : '#5C88C9',
                        color: page === num ? '#1C355F' : '#fff',
                        fontWeight: 300,
                        fontSize: 13,
                        cursor: 'pointer',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        transition: 'all 0.2s',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(Math.ceil(tableData.length / pageSize), p + 1))}
                    disabled={page === Math.ceil(tableData.length / pageSize) || tableData.length === 0}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: '1.5px solid #D9D9D9',
                      background: '#fff',
                      color: '#1C355F',
                      fontWeight: 500,
                      fontSize: 16,
                      cursor: page === Math.ceil(tableData.length / pageSize) || tableData.length === 0 ? 'not-allowed' : 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            </Card>
            <Modal
              open={modalOpen}
              onCancel={() => setModalOpen(false)}
              footer={null}
              title="Detalle de medición"
            >
              {selectedRow && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div><b>Fecha:</b> {dayjs(selectedRow.date_time_medition).format('DD/MM/YYYY HH:mm')}</div>
                  <div><b>Caudal:</b> {selectedRow.flow}</div>
                  <div><b>Acumulado:</b> {selectedRow.total}</div>
                  <div><b>Acumulado /hora (m³):</b> {selectedRow.total_diff}</div>
                  <div><b>Contador diario (m³):</b> {selectedRow.total_today_diff}</div>
                  <div><b>Nivel Freatico (m):</b> {selectedRow.water_table}</div>
                  <div><b>Pulsos:</b> {selectedRow.pulses}</div>
                  <div><b>Enviado a DGA:</b> {selectedRow.send_dga ? 'Sí' : 'No'}</div>
                  <div><b>Creado:</b> {selectedRow.created}</div>
                  <div><b>Modificado:</b> {selectedRow.modified}</div>
                  {/* Agrega aquí más campos si lo deseas */}
                </div>
              )}
            </Modal>
          </Col>
          <Col xs={24} md={10} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', borderLeft: screens.xs ? 'none' : '1px solid #e0e0e0', borderTop: screens.xs ? '1px solid #e0e0e0' : 'none', background: '#fff', minHeight: screens.xs ? 'auto' : 220, padding: screens.xs ? 8 : 0, width: '100%' }}>
            <div style={{ display: 'flex', gap: 12, margin: '24px 0 16px 0' }}>
              <Button type="primary" style={{ background: '#2C3D66', border: 'none', borderRadius: 8, fontWeight: 600 }} onClick={exportToExcel}>
                Descargar Excel
              </Button>
              <Button style={{ border: '1px solid #2C3D66', color: '#2C3D66', borderRadius: 8, fontWeight: 600 }} onClick={previewExcel}>
                Ver Excel
              </Button>
            </div>
            {/* Previsualización de la tabla - solo se muestra al hacer clic en "Ver Excel" */}
            <Modal open={excelModalOpen} onCancel={() => setExcelModalOpen(false)} footer={null} width={900} title="Previsualización de Excel">
              {!selectedCatchmentPoint ? (
                <Alert type="info" message="Seleccione un pozo para visualizar los reportes." showIcon style={{ margin: 32 }} />
              ) : !dateRange || !dateRange[0] || !dateRange[1] ? (
                <Alert type="info" message="Seleccione un rango de fechas para consultar los datos históricos." showIcon style={{ margin: 32 }} />
              ) : tableData.length === 0 ? (
                <Alert type="info" message="No hay datos para mostrar en este periodo." showIcon style={{ margin: 32 }} />
              ) : (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <img src={logoEmpresa} alt="Logo SmartHydro" style={{ height: 48, marginBottom: 8 }} />
                    <h2 style={{ margin: 0 }}>REPORTE DE MEDICIONES</h2>
                    <div style={{ fontWeight: 500, color: '#2C3D66', marginBottom: 12 }}>Empresa: SmartHydro</div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#f0f2f5' }}>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Fecha</th>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Caudal</th>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Acumulado</th>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Acumulado /hora (m³)</th>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Contador diario (m³)</th>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Nivel Freatico (m)</th>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Pulsos</th>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Enviado a DGA</th>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Creado</th>
                          <th style={{ border: '1px solid #e0e0e0', padding: 6 }}>Modificado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, idx) => {
                          const original = dailyInteractions.find(item =>
                            dayjs(item.date_time_medition).format('DD/MM/YYYY') === row.fecha
                          );
                          return (
                            <tr key={idx}>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{row.fecha}</td>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{row.caudal}</td>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{row.acumulado}</td>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{row.acumuladoHora}</td>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{row.contadorDiario}</td>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{row.nivelFreatico}</td>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{original ? original.pulses : ''}</td>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{original ? (original.send_dga ? 'Sí' : 'No') : ''}</td>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{original ? original.created : ''}</td>
                              <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{original ? original.modified : ''}</td>
                            </tr>
                          );
                        })}
                        {/* Fila de resumen */}
                        <tr style={{ background: '#f6faff', fontWeight: 600 }}>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>RESUMEN</td>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{tableData.reduce((acc, row) => acc + Number(row.caudal), 0)}</td>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}>{tableData.length > 0 ? (tableData.reduce((acc, row) => acc + Number(row.nivelFreatico), 0) / tableData.length).toFixed(2) : 0}</td>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: 6 }}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Modal>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default Reportes;
