import React from 'react';
import { Layout, Dropdown, Drawer, Menu } from 'antd';
import { CloseOutlined, DownOutlined, CustomerServiceOutlined, UserOutlined } from '@ant-design/icons';
import styles from './AppLayout.module.css';
import logoIkolu from '../../assets/img/logoikolu.png';
import logoEmpresa from '../../assets/img/logoempresa.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardOutlined, UsergroupAddOutlined, ExperimentOutlined, BarChartOutlined, SettingOutlined, LineChartOutlined, AppstoreOutlined, FileTextOutlined, AlertOutlined } from '@ant-design/icons';

const { Sider } = Layout;

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

const MenuSidebar: React.FC<any> = ({
  isMobile,
  projects,
  selectedProject,
  setSelectedProject,
  onSupportClick,
  drawerOpen,
  onDrawerClose,
  onMenuItemClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
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
    if (location.pathname.startsWith("/dga")) return ["dga"];
    if (location.pathname.startsWith("/documents")) return ["documents"];
    return ["dashboard"];
  }, [location.pathname]);

  const handleMenuClick = (e: any) => {
    const project = projects.find((p: any) => p.id === Number(e.key));
    if (project) setSelectedProject(project);
  };

  const projectMenu = (
    <Menu className={styles.projectDropdownMenu} onClick={handleMenuClick}>
      {projects.map((project: any) => (
        <Menu.Item key={project.id} className={styles.projectDropdownItem}>
          <span>{`P${project.id}`}</span>
          <span className={styles.projectCode}>{project.code}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleMenuClickMobile = (cb: () => void) => {
    cb();
    if (isMobile && onMenuItemClick) onMenuItemClick();
  };

  const handleSupportClick = () => {
    onSupportClick();
    if (isMobile && onMenuItemClick) onMenuItemClick();
  };

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={selectedKeys}
      style={{ background: "#1C355F", borderRight: "none" }}
      className={styles.menuList}
    >
      <Menu.Item key="dashboard" icon={<DashboardOutlined className={styles.menuIcon} />} onClick={() => handleMenuClickMobile(() => navigate("/"))}>Dashboard</Menu.Item>
      <Menu.Item key="clients" icon={<UsergroupAddOutlined className={styles.menuIcon} />} onClick={() => handleMenuClickMobile(() => navigate("/clients"))}>Clientes</Menu.Item>
      <Menu.Item key="telemetry" icon={<ExperimentOutlined className={styles.menuIcon} />} onClick={() => handleMenuClickMobile(() => navigate("/telemetry"))}>Telemetría</Menu.Item>
      <Menu.Item key="smart-analysis" icon={<BarChartOutlined className={styles.menuIcon} />} onClick={() => handleMenuClickMobile(() => navigate("/smart-analysis"))}>Smart Análisis</Menu.Item>
      <Menu.SubMenu key="dga" icon={<SettingOutlined className={styles.menuIcon} />} title={<span>DGA</span>}>
        <Menu.Item 
          key="dga-analisis" 
          icon={<LineChartOutlined className={styles.menuIcon} />} 
          onClick={() => handleMenuClickMobile(() => navigate("/dga/analisis"))}
        >
          DGA Análisis
        </Menu.Item>
        <Menu.Item 
          key="dga-mee" 
          icon={<AppstoreOutlined className={styles.menuIcon} />} 
          onClick={() => handleMenuClickMobile(() => navigate("/dga"))}
        >
          DGA MEE
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="docs" icon={<FileTextOutlined className={styles.menuIcon} />} title={<span>Documentos</span>}>
        <Menu.Item key="documents" icon={<FileTextOutlined className={styles.menuIcon} />} onClick={() => handleMenuClickMobile(() => navigate("/documents"))}>Documentos</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="alerts" icon={<AlertOutlined className={styles.menuIcon} />} onClick={() => handleMenuClickMobile(() => navigate("/alerts"))}>Alertas</Menu.Item>
    </Menu>
  );

  if (isMobile) {
    return (
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={onDrawerClose}
        open={drawerOpen}
        width={237}
        styles={{
          body: { padding: 0, background: '#1C355F', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: 237 },
          header: { background: '#1C355F', borderBottom: '1px solid #3B5484', padding: '0' }
        }}
      >
        <div style={{ padding: '16px 0 4px 0', background: '#1C355F', borderBottom: '1px solid #3B5484', position: 'relative' }}>
          <LogoSection onClose={onDrawerClose} />
        </div>
        <Dropdown overlay={projectMenu} trigger={['click']} placement="bottomLeft" disabled={projects.length === 0} overlayClassName={styles.projectDropdownMenu}>
          <div className={styles.projectSection} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={styles.statusIndicator} />
              <span className={styles.statusText}>{selectedProject ? `P${selectedProject.id}` : ''}</span>
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
              {selectedProject ? selectedProject.code : ''}
              <DownOutlined style={{ width: 10, height: 11.25, color: '#fff', fontSize: 12, marginLeft: 7 }} />
            </span>
          </div>
        </Dropdown>
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {menuContent}
        </div>
        <div className={styles.menuSidebarBottom}>
          <div className={
            location.pathname.startsWith('/support')
              ? `${styles.supportSection} ${styles.supportSectionSelected}`
              : styles.supportSection
          } onClick={handleSupportClick} style={{ cursor: 'pointer' }}>
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
    );
  }

  return (
    <Sider
      width={237}
      className={styles.sidebar}
      style={{ background: '#1C355F', position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 100, display: 'flex', flexDirection: 'column' }}
    >
      <LogoSection />
      <Dropdown overlay={projectMenu} trigger={['click']} placement="bottomLeft" disabled={projects.length === 0} overlayClassName={styles.projectDropdownMenu}>
        <div className={styles.projectSection} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={styles.statusIndicator} />
            <span className={styles.statusText}>{selectedProject ? `P${selectedProject.id}` : ''}</span>
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
            {selectedProject ? selectedProject.code : ''}
            <DownOutlined style={{ width: 10, height: 11.25, color: '#fff', fontSize: 12, marginLeft: 7 }} />
          </span>
        </div>
      </Dropdown>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {menuContent}
      </div>
      <div className={styles.menuSidebarBottom}>
        <div className={
          location.pathname.startsWith('/support')
            ? `${styles.supportSection} ${styles.supportSectionSelected}`
            : styles.supportSection
        } onClick={onSupportClick} style={{ cursor: 'pointer' }}>
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
  );
};

export default MenuSidebar; 