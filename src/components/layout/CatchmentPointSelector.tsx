import React from 'react';
import { Dropdown, Menu, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DatabaseTwoTone, EyeInvisibleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styles from './AppLayout.module.css';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';
import { useDgaConfigCatchment } from '../../hooks/useDgaConfigCatchment';
import { useProfileConfigCatchment } from '../../hooks/useProfileConfigCatchment';

interface CatchmentPointSelectorProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const CatchmentPointSelector: React.FC<CatchmentPointSelectorProps> = ({ selectedId, onSelect }) => {
  const { catchmentPoints, selectedCatchmentPoint, getAll } = useSelectedCatchmentPoint();
  const { dgaConfigs, getAllDgaConfigs } = useDgaConfigCatchment();
  const { profileDataConfigs, getProfileDataConfigs } = useProfileConfigCatchment();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    if (catchmentPoints.length === 0 && !loading && !error) {
      setLoading(true);
      getAll().catch(setError).finally(() => setLoading(false));
    }
    getAllDgaConfigs();
    getProfileDataConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Usar el pozo seleccionado del contexto para mostrar el código fijo
  const selected = selectedCatchmentPoint || catchmentPoints.find(cp => cp.id === selectedId);

  // Filtrar solo los pozos que tengan datos DGA o perfil
  const dgaIds = dgaConfigs.map(cfg => cfg.point_catchment);
  const profileIds = profileDataConfigs.map(cfg => cfg.point_catchment);
  const validCatchmentPoints = showAll
    ? catchmentPoints
    : catchmentPoints.filter(cp => dgaIds.includes(cp.id) || profileIds.includes(cp.id));

  // Buscar el code_dga correspondiente al pozo seleccionado
  const getCodeDga = (id: number) => {
    const dga = dgaConfigs.find(cfg => cfg.point_catchment === id);
    return dga?.code_dga || '--';
  };

  const menu = (
    <Menu onClick={({ key }) => {
      if (key === 'toggleShowAll') {
        setShowAll((prev) => !prev);
      } else {
        onSelect(Number(key));
      }
    }}>
      {validCatchmentPoints.map(cp => (
        <Menu.Item key={cp.id}>
          <span style={{ fontWeight: 600, color: '#1C355F' }}>{`P${cp.id}`}</span>
          <span style={{ background: '#3368AB', color: '#fff', borderRadius: 4, padding: '2px 10px', fontSize: 13, fontWeight: 500, marginLeft: 8 }}>
            {getCodeDga(cp.id)}
          </span>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item key="toggleShowAll" style={{ color: '#1677ff', fontWeight: 600, textAlign: 'center' }}>
        {showAll ? (
          <>
            <EyeInvisibleOutlined style={{ marginRight: 6 }} />
            Ocultar pozos sin datos
          </>
        ) : (
          <>
            <DatabaseTwoTone twoToneColor="#1677ff" style={{ marginRight: 6 }} />
            Mostrar todos los pozos
          </>
        )}
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
      <div className={styles.projectSection} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
        {/* SIEMPRE mostrar P{id} a la izquierda */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={styles.statusIndicator} />
          <span className={styles.statusText}>{selected ? `P${selected.id}` : ''}</span>
        </span>
        {/* Botón azul solo muestra el código DGA */}
        <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft" overlayClassName={styles.projectDropdownMenu}>
          <span style={{ background: '#3368AB', color: '#fff', borderRadius: 4, padding: '2px 10px', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0, minWidth: 80, justifyContent: 'center', marginRight: 8, cursor: 'pointer' }}>
            {selected ? getCodeDga(selected.id) : '--'}
            <DownOutlined style={{ width: 10, height: 11.25, color: '#fff', fontSize: 12, marginLeft: 7 }} />
          </span>
        </Dropdown>
        {loading && <Spin size="small" style={{ marginLeft: 8 }} />}
      </div>
      {/* Mensaje explicativo */}
      {!showAll && validCatchmentPoints.length < catchmentPoints.length && (
        <span style={{ fontSize: 12, color: '#64748B', marginTop: 4, display: 'flex', alignItems: 'center' }}>
          <InfoCircleOutlined style={{ marginRight: 4 }} />
          Solo se muestran pozos con datos disponibles de DGA o perfil.
        </span>
      )}
    </div>
  );
};

export default CatchmentPointSelector; 