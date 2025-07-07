import React from "react";
import { Layout, Menu, Dropdown, Drawer, Button } from "antd";
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  FileTextOutlined,
  AlertOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  DownOutlined,
  MenuOutlined,
  CloseOutlined,
  LineChartOutlined,
  SettingOutlined,
  AppstoreOutlined,
  ExperimentOutlined
} from "@ant-design/icons";
import styles from "./AppLayout.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import logoIkolu from "../../assets/img/logoikolu.png";
import logoEmpresa from "../../assets/img/logoempresa.png";
import { projectService } from "../../api/projectService";
import type { Project } from "../../api/projectService";
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useHeaderActions } from '../../context/HeaderActionsContext';
import { SelectedProjectProvider, useSelectedProject } from '../../context/SelectedProjectContext';

const { Sider, Header, Content } = Layout;

const headerMap: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Sistema de gestión" },
  "/profile": { title: "Perfil de usuario", subtitle: "Gestiona tu cuenta" },
  "/catchment": { title: "Puntos de Captación", subtitle: "Listado de puntos" },
  "/catchment/new": { title: "Nuevo Punto de Captación", subtitle: "Crear punto" },
  "/clients": { title: "Clientes", subtitle: "Proyectos Recientes" },
  "/clients/create": { title: "Crear nuevo cliente", subtitle: "Agregar información" },
  "/groups": { title: "Grupos", subtitle: "Listado de grupos" },
  "/groups/create": { title: "Nuevo Grupo", subtitle: "Crear grupo" },
  "/smart-analysis": { title: "Smart Análisis", subtitle: "Análisis inteligente" },
  "/alerts": { title: "Alertas", subtitle: "Gestión de alertas" },
  "/alerts/create": { title: "Alertas", subtitle: "Gestión de alertas" },
  "/support": { title: "Soporte", subtitle: "Gestión de tickets y solicitudes de ayudas" },
  "/dga": { title: "DGA MEE", subtitle: "Extracción de datos MEE" },
  "/dga/analisis": { title: "DGA Análisis", subtitle: "Monitoreo y análisis de mediciones" },
};

const LogoSection = ({ onClose }: { onClose?: () => void }) => (
  <div className={styles.logoSection} style={{ position: 'relative', width: '100%' }}>
    {onClose && (
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 0, left: 0, background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 2, padding: 8 }}
        aria-label="Cerrar menú"
      >
        <CloseOutlined style={{ fontSize: 24, color: '#fff' }} />
      </button>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <img src={logoIkolu} alt="Ikolu App logo" className={styles.logoIkolu} />
      <span className={styles.logoText}>Ikolu App</span>
    </div>
  </div>
);

const AppLayoutInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const { selectedProject, setSelectedProject } = useSelectedProject();
  const { isMobile } = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { headerActions } = useHeaderActions();

  React.useEffect(() => {
    projectService.getAll().then((data) => {
      setProjects(data);
    });
  }, []);

  const selectedKeys = React.useMemo(() => {
    if (location.pathname === "/dga") return ["dga-mee"];
    if (location.pathname === "/dga/analisis") return ["dga-analisis"];
    if (location.pathname.startsWith("/clients")) return ["clients"];
    if (location.pathname.startsWith("/catchment")) return ["catchment"];
    if (location.pathname.startsWith("/groups")) return ["groups"];
    if (location.pathname.startsWith("/smart-analysis")) return ["smart-analysis"];
    if (location.pathname.startsWith("/telemetry")) return ["telemetry"];
    if (location.pathname.startsWith("/alerts")) return ["alerts"];
    if (location.pathname.startsWith("/support")) return ["support"];
    return ["dashboard"];
  }, [location.pathname]);

  const handleMenuClick = (e: any) => {
    const project = projects.find((p) => p.id === Number(e.key));
    if (project) setSelectedProject(project);
  };

  const projectMenu = (
    <Menu className={styles.projectDropdownMenu} onClick={handleMenuClick}>
      {projects.map((project) => (
        <Menu.Item key={project.id} className={styles.projectDropdownItem}>
          <span>{`P${project.id}`}</span>
          <span className={styles.projectCode}>{project.code}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={selectedKeys}
      style={{ background: "#1C355F", borderRight: "none" }}
      className={styles.menuList}
      onClick={() => isMobile && setDrawerOpen(false)}
    >
      <Menu.Item key="dashboard" icon={<DashboardOutlined className={styles.menuIcon} />} onClick={() => navigate("/")}>Dashboard</Menu.Item>
      <Menu.Item key="clients" icon={<UsergroupAddOutlined className={styles.menuIcon} />} onClick={() => navigate("/clients")}>Clientes</Menu.Item>
      <Menu.Item key="telemetry" icon={<ExperimentOutlined className={styles.menuIcon} />} onClick={() => navigate("/telemetry")}>Telemetría</Menu.Item>
      <Menu.Item key="smart-analysis" icon={<BarChartOutlined className={styles.menuIcon} />} onClick={() => navigate("/smart-analysis")}>Smart Análisis</Menu.Item>
      <Menu.SubMenu key="dga" icon={<SettingOutlined className={styles.menuIcon} />} title={<span>DGA</span>}>
        <Menu.Item 
          key="dga-analisis" 
          icon={<LineChartOutlined className={styles.menuIcon} />} 
          onClick={() => navigate("/dga/analisis")}
        >
          DGA Análisis
        </Menu.Item>
        <Menu.Item 
          key="dga-mee" 
          icon={<AppstoreOutlined className={styles.menuIcon} />} 
          onClick={() => navigate("/dga")}
        >
          DGA MEE
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="docs" icon={<FileTextOutlined className={styles.menuIcon} />} title={<span>Documentos</span>}>
        <Menu.Item key="docs-1" icon={<FileTextOutlined className={styles.menuIcon} />} disabled>Documentos 1</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="alerts" icon={<AlertOutlined className={styles.menuIcon} />} onClick={() => navigate("/alerts")}>Alertas</Menu.Item>
    </Menu>
  );

  // Header dinámico para Telemetría
  let header = headerMap[location.pathname] || { title: '', subtitle: '' };
  if (location.pathname === '/telemetry') {
    header = {
      title: 'Telemetría',
      subtitle: selectedProject ? `Monitoreo en tiempo real del pozo P${selectedProject.id}` : 'Monitoreo en tiempo real del pozo',
    };
  }

  return (
    <Layout className={styles.appLayout}>
      {!isMobile && (
        <Sider
          width={237}
          className={styles.sidebar}
          style={{ background: "#1C355F", position: "fixed", left: 0, top: 0, height: "100vh", zIndex: 100, display: 'flex', flexDirection: 'column' }}
        >
          <LogoSection />
          <Dropdown overlay={projectMenu} trigger={["click"]} placement="bottomLeft" disabled={projects.length === 0} overlayClassName={styles.projectDropdownMenu}>
            <div className={styles.projectSection} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={styles.statusIndicator} />
                <span className={styles.statusText}>{selectedProject ? `P${selectedProject.id}` : ""}</span>
              </span>
              <span style={{
                background: '#3368AB',
                color: '#fff',
                borderRadius: 4,
                padding: '2px 10px',
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                minWidth: 80,
                justifyContent: 'center',
                marginRight: 8,
              }}>
                {selectedProject ? selectedProject.code : ""}
                <DownOutlined style={{ width: 10, height: 11.25, color: '#fff', fontSize: 12, marginLeft: 7 }} />
              </span>
            </div>
          </Dropdown>
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {menuContent}
          </div>
          <div className={styles.menuSidebarBottom}>
            <div 
              className={`${styles.supportSection} ${location.pathname.startsWith("/support") ? styles.supportSectionSelected : ""}`} 
              onClick={() => {
                navigate("/support");
                isMobile && setDrawerOpen(false);
              }} 
              style={{ cursor: 'pointer' }}
            >
              <CustomerServiceOutlined className={styles.supportIcon} />
              <span className={styles.supportText}>Soporte</span>
            </div>
            <div className={styles.userSection}>
              <div className={styles.avatar}>
                <UserOutlined className={styles.avatarIcon} />
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>Usuario</span>
                <span className={styles.userRole}>Operador</span>
              </div>
            </div>
            <div className={styles.logoSection1}>
              <img src={logoEmpresa} alt="Logo Empresa" className={styles.logoEmpresa} />
            </div>
          </div>
        </Sider>
      )}
      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          closable={false}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={237}
          styles={{
            body: { padding: 0, background: '#1C355F', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: 237 },
            header: { background: '#1C355F', borderBottom: '1px solid #3B5484', padding: '0' }
          }}
        >
          <div style={{ padding: '16px 0 4px 0', background: '#1C355F', borderBottom: '1px solid #3B5484', position: 'relative' }}>
            <LogoSection onClose={() => setDrawerOpen(false)} />
          </div>
          <Dropdown overlay={projectMenu} trigger={["click"]} placement="bottomLeft" disabled={projects.length === 0} overlayClassName={styles.projectDropdownMenu}>
            <div className={styles.projectSection} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={styles.statusIndicator} />
                <span className={styles.statusText}>{selectedProject ? `P${selectedProject.id}` : ""}</span>
              </span>
              <span style={{
                background: '#3368AB',
                color: '#fff',
                borderRadius: 4,
                padding: '2px 10px',
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                minWidth: 80,
                justifyContent: 'center',
                marginRight: 8,
              }}>
                {selectedProject ? selectedProject.code : ""}
                <DownOutlined style={{ width: 10, height: 11.25, color: '#fff', fontSize: 12, marginLeft: 7 }} />
              </span>
            </div>
          </Dropdown>
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {menuContent}
          </div>
          <div className={styles.menuSidebarBottom}>
            <div 
              className={`${styles.supportSection} ${location.pathname.startsWith("/support") ? styles.supportSectionSelected : ""}`} 
              onClick={() => {
                navigate("/support");
                isMobile && setDrawerOpen(false);
              }} 
              style={{ cursor: 'pointer' }}
            >
              <CustomerServiceOutlined className={styles.supportIcon} />
              <span className={styles.supportText}>Soporte</span>
            </div>
            <div className={styles.userSection}>
              <div className={styles.avatar}>
                <UserOutlined className={styles.avatarIcon} />
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>Usuario</span>
                <span className={styles.userRole}>Operador</span>
              </div>
            </div>
            <div className={styles.logoSection1}>
              <img src={logoEmpresa} alt="Logo Empresa" className={styles.logoEmpresa} />
            </div>
          </div>
        </Drawer>
      )}
      <Layout className={styles.mainLayout} style={{ marginLeft: isMobile ? 0 : 237 }}>
        <Header className={styles.header} style={{ background: "#fff", padding: 0, height: 105, minHeight: 105, borderBottom: '1px solid #D1D5DB', zIndex: 10, display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <div className={styles.hamburgerContainer}>
              <Button
                type="text"
                icon={
                  <MenuOutlined className={styles.hamburgerIcon} />
                }
                onClick={() => setDrawerOpen(true)}
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
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SelectedProjectProvider>
    <AppLayoutInner>{children}</AppLayoutInner>
  </SelectedProjectProvider>
);

export default AppLayout;
