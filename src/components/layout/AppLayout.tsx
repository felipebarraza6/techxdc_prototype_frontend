import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  RadarChartOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  AlertOutlined,
  FileProtectOutlined,
  FileUnknownOutlined,
  CustomerServiceOutlined,
  UserOutlined
} from "@ant-design/icons";
import styles from "./AppLayout.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import logoIkolu from "../../assets/img/logoikolu.png";
import logoEmpresa from "../../assets/img/logoempresa.png";

const { Sider, Header, Content } = Layout;

const headerMap: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Sistema de gestión" },
  "/profile": { title: "Perfil de usuario", subtitle: "Gestiona tu cuenta" },
  "/catchment": { title: "Puntos de Captación", subtitle: "Listado de puntos" },
  "/catchment/new": { title: "Nuevo Punto de Captación", subtitle: "Crear punto" },
  "/clients": { title: "Clientes", subtitle: "Proyectos Recientes" },
  "/clients/create": { title: "Nuevo Cliente", subtitle: "Crear cliente" },
  "/groups": { title: "Grupos", subtitle: "Listado de grupos" },
  "/groups/create": { title: "Nuevo Grupo", subtitle: "Crear grupo" },
  "/smart-analysis": { title: "Smart Analysis", subtitle: "Análisis inteligente" },
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const header = headerMap[location.pathname] || { title: "", subtitle: "" };

  // Determinar el menú seleccionado
  const selectedKeys = React.useMemo(() => {
    if (location.pathname.startsWith("/clients")) return ["clients"];
    if (location.pathname.startsWith("/catchment")) return ["catchment"];
    if (location.pathname.startsWith("/groups")) return ["groups"];
    if (location.pathname.startsWith("/smart-analysis")) return ["smart-analysis"];
    return ["dashboard"];
  }, [location.pathname]);

  return (
    <Layout className={styles.appLayout}>
      <Sider
        width={237}
        className={styles.sidebar}
        style={{ background: "#1C355F", position: "fixed", left: 0, top: 0, height: "100vh", zIndex: 100, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className={styles.logoSection}>
            <img src={logoIkolu} alt="Ikolu App logo" className={styles.logoIkolu} />
            <span className={styles.logoText}>Ikolu App</span>
          </div>
          <div className={styles.projectSection}>
            <span className={styles.statusIndicator} />
            <span className={styles.statusText}>P2</span>
            <div className={styles.projectButton}>OB-0902-77</div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            style={{ background: "#1C355F", borderRight: "none" }}
            className={styles.menuList}
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined className={styles.menuIcon} />} onClick={() => navigate("/")}>Dashboard</Menu.Item>
            <Menu.Item key="clients" icon={<UsergroupAddOutlined className={styles.menuIcon} />} onClick={() => navigate("/clients")}>Clientes</Menu.Item>
            <Menu.Item key="catchment" icon={<RadarChartOutlined className={styles.menuIcon} />} onClick={() => navigate("/catchment")}>Telemetría</Menu.Item>
            <Menu.Item key="smart-analysis" icon={<BarChartOutlined className={styles.menuIcon} />} disabled>Smart Análisis</Menu.Item>
            <Menu.SubMenu key="dga" icon={<FileSearchOutlined className={styles.menuIcon} />} title={<span>DGA</span>}>
              <Menu.Item key="dga-analisis" icon={<FileProtectOutlined className={styles.menuIcon} />} disabled>DGA Análisis</Menu.Item>
              <Menu.Item key="dga-waez" icon={<FileUnknownOutlined className={styles.menuIcon} />} disabled>DGA WAEZ</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="docs" icon={<FileTextOutlined className={styles.menuIcon} />} title={<span>Documentos</span>}>
              <Menu.Item key="docs-1" icon={<FileTextOutlined className={styles.menuIcon} />} disabled>Documentos 1</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="alerts" icon={<AlertOutlined className={styles.menuIcon} />} disabled>Alertas</Menu.Item>
          </Menu>
        </div>
        <div className={styles.menuSidebarBottom}>
          <div className={styles.supportSection}>
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
      <Layout className={styles.mainLayout} style={{ marginLeft: 237 }}>
        <Header className={styles.header} style={{ background: "#fff", padding: 0, height: 105, minHeight: 105, borderBottom: '1px solid #D1D5DB', zIndex: 10 }}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{header.title}</h1>
            {header.subtitle && <span className={styles.subtitle}>{header.subtitle}</span>}
          </div>
        </Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
