import React, { useState } from 'react';
import { Card, Button, Table, Divider, Row, Col, Grid } from 'antd';
import { FileOutlined, EyeOutlined } from '@ant-design/icons';
import { mockCards, mockRows } from '../../mocks/reportesMock';

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
    render: () => <EyeOutlined style={{ color: '#90a4ae', fontSize: 18, cursor: 'pointer' }} />,
    width: 40,
  },
];

const caudalOptions = ['Caudal', 'Acumulado', 'Acumulado/Hora'];
const infoOptions = ['Nivel Freatico', 'Contador Diario'];

const Reportes: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCaudal, setSelectedCaudal] = useState<number[]>(mockCards.map(() => -1));
  const [selectedInfo, setSelectedInfo] = useState<number[]>(mockCards.map(() => -1));
  const screens = Grid.useBreakpoint();

  const handleSelectCaudal = (cardIdx: number, optionIdx: number) => {
    setSelectedCaudal((prev) =>
      prev.map((v, i) => (i === cardIdx ? (v === optionIdx ? -1 : optionIdx) : v))
    );
  };
  const handleSelectInfo = (cardIdx: number, optionIdx: number) => {
    setSelectedInfo((prev) =>
      prev.map((v, i) => (i === cardIdx ? (v === optionIdx ? -1 : optionIdx) : v))
    );
  };

  return (
    <div style={{ background: '#fafbfc', minHeight: '100vh', width: '100%' }}>
      <Row gutter={[24, 24]} wrap style={{ width: '100%', margin: 0 }}>
        {/* Columna principal */}
        <Col xs={24} md={14} style={{ width: '100%' }}>
          <h3 style={{ marginBottom: 16, color: '#1C355F' }}>Visualizados recientemente</h3>
          <Row gutter={[16, 16]} wrap>
            {mockCards.map((card, idx) => (
              <Col xs={24} sm={24} md={12} key={idx}>
                <Card
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    background: '#fff',
                    margin: 0,
                    width: '100%',
                  }}
                  bodyStyle={{ padding: screens.xs ? 10 : 20 }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4, fontSize: screens.xs ? 13 : 15, color: '#1C355F' }}>Fecha/Hora</div>
                  <div style={{ marginBottom: 12, color: '#64748B', fontSize: screens.xs ? 12 : 14 }}>{card.date} / hrs</div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 8, width: '100%', justifyContent: 'center' }}>
                    {caudalOptions.map((option, optionIdx) => (
                      <Button
                        key={option}
                        size="small"
                        style={{
                          background: selectedCaudal[idx] === optionIdx ? '#5C88C9' : '#D9D9D9',
                          color: selectedCaudal[idx] === optionIdx ? '#fff' : '#1C355F',
                          border: 'none',
                          transition: 'background 0.2s',
                          flex: screens.xs ? 1 : undefined,
                          minWidth: screens.xs ? 0 : undefined,
                        }}
                        onClick={() => handleSelectCaudal(idx, optionIdx)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 8, width: '100%', justifyContent: 'center' }}>
                    {infoOptions.map((option, optionIdx) => (
                      <Button
                        key={option}
                        size="small"
                        style={{
                          background: selectedInfo[idx] === optionIdx ? '#5C88C9' : '#D9D9D9',
                          color: selectedInfo[idx] === optionIdx ? '#fff' : '#1C355F',
                          border: 'none',
                          transition: 'background 0.2s',
                          flex: screens.xs ? 1 : undefined,
                          minWidth: screens.xs ? 0 : undefined,
                        }}
                        onClick={() => handleSelectInfo(idx, optionIdx)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 32, marginTop: 8, fontSize: screens.xs ? 13 : 15, color: '#1C355F', fontWeight: 600, justifyContent: 'center', width: '100%' }}>
                    <span>{card.nivelFreatico}</span>
                    <span>{card.contadorDiario}</span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Card style={{ padding: 0, marginTop: 24 }} bodyStyle={{ padding: screens.xs ? 4 : 0 }}>
            <Table
              columns={columns.map(col =>
                col.key !== 'action'
                  ? { ...col, render: (text: string) => <span style={{ color: '#1C355F', fontSize: screens.xs ? 11 : 14, wordBreak: 'break-word' }}>{text}</span> }
                  : col
              )}
              dataSource={mockRows.map((row, idx) => ({ ...row, key: idx }))}
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
            {/* Paginación custom */}
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
                {[1, 2, 3, 4, 5].map((num) => (
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
                  onClick={() => setPage((p) => Math.min(5, p + 1))}
                  disabled={page === 5}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '1.5px solid #D9D9D9',
                    background: '#fff',
                    color: '#1C355F',
                    fontWeight: 500,
                    fontSize: 16,
                    cursor: page === 5 ? 'not-allowed' : 'pointer',
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
        </Col>
        {/* Panel derecho */}
        <Col xs={24} md={10} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: screens.xs ? 'none' : '1px solid #e0e0e0', borderTop: screens.xs ? '1px solid #e0e0e0' : 'none', background: '#fff', minHeight: screens.xs ? 'auto' : 220, padding: screens.xs ? 8 : 0, width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <FileOutlined style={{ fontSize: screens.xs ? 40 : 64, color: '#1C355F', marginBottom: 16 }} />
            <div style={{ color: '#64748B', fontSize: screens.xs ? 13 : 16, textAlign: 'center' }}>
              Seleccione un documento para previsualizar
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Reportes;
