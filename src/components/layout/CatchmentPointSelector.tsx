import React, { useEffect } from 'react';
import { Dropdown, Menu, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './AppLayout.module.css';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';

interface CatchmentPointSelectorProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const CatchmentPointSelector: React.FC<CatchmentPointSelectorProps> = ({ selectedId, onSelect }) => {
  const { catchmentPoints, selectedCatchmentPoint, getAll } = useSelectedCatchmentPoint();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (catchmentPoints.length === 0 && !loading && !error) {
      setLoading(true);
      getAll().catch(setError).finally(() => setLoading(false));
    }
  }, [getAll, catchmentPoints.length, loading, error]);

  // Usar el pozo seleccionado del contexto para mostrar el código fijo
  const selected = selectedCatchmentPoint || catchmentPoints.find(cp => cp.id === selectedId);

  const menu = (
    <Menu onClick={({ key }) => onSelect(Number(key))}>
      {catchmentPoints.map(cp => (
        <Menu.Item key={cp.id}>
          <span style={{ fontWeight: 600, color: '#1C355F' }}>{`P${cp.id}`}</span>
          <span style={{ background: '#3368AB', color: '#fff', borderRadius: 4, padding: '2px 10px', fontSize: 13, fontWeight: 500, marginLeft: 8 }}>
            {cp.code || '--'}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className={styles.projectSection} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
      {/* SIEMPRE mostrar P{id} a la izquierda */}
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className={styles.statusIndicator} />
        <span className={styles.statusText}>{selected ? `P${selected.id}` : ''}</span>
      </span>
      {/* Botón azul solo muestra el código */}
      <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft" overlayClassName={styles.projectDropdownMenu}>
        <span style={{ background: '#3368AB', color: '#fff', borderRadius: 4, padding: '2px 10px', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0, minWidth: 80, justifyContent: 'center', marginRight: 8, cursor: 'pointer' }}>
          {selected ? (selected.code || '--') : '--'}
          <DownOutlined style={{ width: 10, height: 11.25, color: '#fff', fontSize: 12, marginLeft: 7 }} />
        </span>
      </Dropdown>
      {loading && <Spin size="small" style={{ marginLeft: 8 }} />}
    </div>
  );
};

export default CatchmentPointSelector; 