import React from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DatabaseTwoTone, EyeInvisibleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styles from './AppLayout.module.css';
import { useDgaConfigCatchment } from '../../hooks/useDgaConfigCatchment';
import { useProfileConfigCatchment } from '../../hooks/useProfileConfigCatchment';
import type {  CatchmentsApiResponse } from '../../hooks/useCatchmentPoint';

interface CatchmentPointSelectorProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const CatchmentPointSelector: React.FC<CatchmentPointSelectorProps> = ({ selectedId, onSelect }) => {
  const catchmentPoints: CatchmentsApiResponse[] = JSON.parse(localStorage.getItem("catchmentPoints") || "[]");
  const { dgaConfigs, getAllDgaConfigs } = useDgaConfigCatchment();
  const { profileDataConfigs, getProfileDataConfigs } = useProfileConfigCatchment();
  const [showAll, setShowAll] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    getAllDgaConfigs();
    getProfileDataConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Usar el pozo seleccionado del contexto para mostrar el código fijo
  const selected = catchmentPoints.find((cp: CatchmentsApiResponse) => cp.id === selectedId);

  // Filtrar solo los pozos que tengan datos DGA o perfil
  const dgaIds = dgaConfigs.map(cfg => cfg.point_catchment);
  const profileIds = profileDataConfigs.map(cfg => cfg.point_catchment);
  const validCatchmentPoints = showAll
    ? catchmentPoints
    : catchmentPoints.filter((cp: CatchmentsApiResponse) => dgaIds.includes(cp.id) || profileIds.includes(cp.id));

  // Buscar el code_dga correspondiente al pozo seleccionado
  const getCodeDga = (id: number) => {
    const dga = dgaConfigs.find(cfg => cfg.point_catchment === id);
    return dga?.code_dga || 'Sin O.B';
  };

  const menu = (
    <Menu>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'space-around' }}>
        {validCatchmentPoints
          .filter((cp: CatchmentsApiResponse) => typeof cp.id === 'number' && cp.id !== undefined && cp.id !== null)
          .map((cp: CatchmentsApiResponse) => (
            <Menu.Item key={cp.id} style={{ padding: 0 }} onClick={() => {
              onSelect(cp.id);
              setDropdownOpen(false);
            }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <span style={{ fontWeight: 600, color: '#1C355F', minWidth: 38, textAlign: 'left', paddingLeft: 12 }}>{`P${cp.id}`}</span>
                <span style={{ background: '#3368AB', color: '#fff', borderRadius: 4, padding: '2px 10px', fontSize: 13, fontWeight: 500, marginLeft: 'auto', minWidth: 90, textAlign: 'center', display: 'inline-block' }}>
                  {getCodeDga(cp.id)}
                </span>
              </div>
            </Menu.Item>
          ))}
      </div>
      <Menu.Divider />
      <div
        style={{ color: '#1677ff', fontWeight: 600, textAlign: 'center', cursor: 'pointer', padding: '8px 0' }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setShowAll(prev => !prev);
          setDropdownOpen(true);
        }}
      >
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
      </div>
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
        <Dropdown
          overlay={menu}
          trigger={['click']}
          placement="bottomLeft"
          overlayClassName={styles.projectDropdownMenu}
          open={dropdownOpen}
          onOpenChange={setDropdownOpen}
        >
          <span style={{ background: '#3368AB', color: '#fff', borderRadius: 4, padding: '2px 10px', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0, minWidth: 80, justifyContent: 'center', marginRight: 8, cursor: 'pointer' }}>
            {selected ? getCodeDga(selected.id) : '--'}
            <DownOutlined style={{ width: 10, height: 11.25, color: '#fff', fontSize: 12, marginLeft: 7 }} />
          </span>
        </Dropdown>
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