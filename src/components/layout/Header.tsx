import React from 'react';
import { Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styles from './AppLayout.module.css';
import { useLocation } from 'react-router-dom';

const { Header } = Layout;

const headerMap: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Sistema de gestión" },
  "/profile": { title: "Perfil de usuario", subtitle: "Gestiona tu cuenta" },
  "/catchment": { title: "Puntos de Captación", subtitle: "Listado de puntos" },
  "/catchment/new": { title: "Nuevo Punto de Captación", subtitle: "Crear punto" },
  "/clients": { title: "Clientes", subtitle: "Proyectos Recientes" },
  "/clients/create": { title: "Crear nuevo cliente", subtitle: "Agregar información" },
  "/groups": { title: "Grupos", subtitle: "Listado de grupos" },
  "/groups/create": { title: "Nuevo Grupo", subtitle: "Crear grupo" },
  "/smart-analysis": { title: "Smart Análisis", subtitle: "Monitoreo y análisis de datos hidráulicos" },
  "/alerts": { title: "Alertas", subtitle: "Gestión de alertas" },
  "/alerts/create": { title: "Alertas", subtitle: "Gestión de alertas" },
  "/support": { title: "Soporte", subtitle: "Gestión de tickets y solicitudes de ayudas" },
  "/dga": { title: "DGA MEE", subtitle: "Extracción de datos MEE" },
  "/dga/analisis": { title: "DGA Análisis", subtitle: "Monitoreo y análisis de mediciones" },
  "/documents": { title: "Documentos", subtitle: "Gestión Documental del Sistema" },
  "/documents/reportes": { title: "Reportes", subtitle: "Descarga de documentos del sistema" }
};

interface HeaderProps {
  selectedProject?: any;
  selectedCatchmentPoint?: any;
  headerActions?: React.ReactNode;
  isMobile: boolean;
  onMenuClick?: () => void;
}

const AppHeader: React.FC<HeaderProps> = ({ selectedProject, selectedCatchmentPoint, headerActions, isMobile, onMenuClick }) => {
  const location = useLocation();
  let header = headerMap[location.pathname] || { title: '', subtitle: '' };
  if (location.pathname === '/telemetry') {
    header = {
      title: 'Telemetría',
      subtitle: selectedCatchmentPoint
        ? `Monitoreo en tiempo real del punto de captación ${selectedCatchmentPoint.name || `P${selectedCatchmentPoint.id}`}`
        : 'Monitoreo en tiempo real del pozo',
    };
  }
  return (
    <Header className={styles.header} style={{ background: '#fff', padding: 0, height: 105, minHeight: 105, borderBottom: '1px solid #D1D5DB', zIndex: 10, display: 'flex', alignItems: 'center' }}>
      {isMobile && (
        <div className={styles.hamburgerContainer}>
          <Button
            type="text"
            icon={<MenuOutlined className={styles.hamburgerIcon} />}
            onClick={onMenuClick}
            className={styles.hamburgerButton}
            style={{ marginLeft: 0, marginRight: 0 }}
          />
        </div>
      )}
      <div className={styles.headerContent} style={{ flex: 1 }}>
        {header.title && <h1 className={styles.title}>{header.title}</h1>}
        {header.subtitle && <span className={styles.subtitle}>{header.subtitle}</span>}
      </div>
      {headerActions && (
        <div className={styles.headerActions} style={{ marginRight: isMobile ? 8 : 32, display: 'flex', alignItems: 'center', gap: 16 }}>
          {headerActions}
        </div>
      )}
    </Header>
  );
};

export default AppHeader; 