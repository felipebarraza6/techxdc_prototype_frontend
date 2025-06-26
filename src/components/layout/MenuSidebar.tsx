import React from "react";
import styles from "./MenuSidebar.module.css";
import logoIkolu from "../../assets/img/logoikolu.png";
import logoEmpresa from "../../assets/img/logoempresa.png";
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  RadarChartOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  AlertOutlined,
  DownOutlined,
  FileProtectOutlined,
  FileUnknownOutlined,
  CustomerServiceOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface MenuSidebarProps {
  className?: string;
}

const MenuSidebar: React.FC<MenuSidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const [openDga, setOpenDga] = React.useState(false);
  const [openDocs, setOpenDocs] = React.useState(false);

  return (
    <aside className={`${styles.menuSidebar} ${className || ""}`}>
      <div className={styles.logoSection}>
        <img
          src={logoIkolu}
          alt="Ikolu App logo"
          className={styles.logoIkolu}
        />
        <span className={styles.logoText}>Ikolu App</span>
      </div>

      <div className={styles.projectSection}>
        <span className={styles.statusIndicator} />
        <span className={styles.statusText}>P2</span> {/*placeholder for project status*/}
        <div className={styles.projectButton}>OB-0902-77</div> {/*placeholder for project name*/}
      </div>

      <nav className={styles.menuNav}>
        <ul className={styles.menuList}>
          <li className={styles.menuItem} onClick={() => navigate("/")}>
            <DashboardOutlined className={styles.menuIcon} /> Dashboard
          </li>
          <li className={styles.menuItem} onClick={() => navigate("/clients")}>
            <UsergroupAddOutlined className={styles.menuIcon} /> Clientes
          </li>
          <li className={styles.menuItem} onClick={() => navigate("/catchment")}>
            <RadarChartOutlined className={styles.menuIcon} /> Telemetría
          </li>
          <li className={styles.menuItem} style={{ cursor: 'not-allowed', opacity: 0.6 }}>
            <BarChartOutlined className={styles.menuIcon} /> Smart Análisis
          </li>
          {/* DGA con submenú */}
          <li className={styles.menuItem} onClick={() => setOpenDga(v => !v)}>
            <FileSearchOutlined className={styles.menuIcon} /> DGA <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
          </li>
          {openDga && (
            <ul className={styles.subMenuList}>
              <li className={styles.subMenuItem} style={{ paddingLeft: 32, cursor: 'not-allowed', opacity: 0.6 }}>
                <FileProtectOutlined className={styles.menuIcon} /> DGA Análisis
              </li>
              <li className={styles.subMenuItem} style={{ paddingLeft: 32, cursor: 'not-allowed', opacity: 0.6 }}>
                <FileUnknownOutlined className={styles.menuIcon} /> DGA WAEZ
              </li>
            </ul>
          )}
          {/* Documentos con submenú */}
          <li className={styles.menuItem} onClick={() => setOpenDocs(v => !v)}>
            <FileTextOutlined className={styles.menuIcon} /> Documentos <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
          </li>
          {openDocs && (
            <ul className={styles.subMenuList}>
              <li className={styles.subMenuItem} style={{ paddingLeft: 32, cursor: 'not-allowed', opacity: 0.6 }}>
                <FileTextOutlined className={styles.menuIcon} /> Documentos 1
              </li>
            </ul>
          )}
          <li className={styles.menuItem} style={{ cursor: 'not-allowed', opacity: 0.6 }}>
            <AlertOutlined className={styles.menuIcon} /> Alertas
          </li>
          <div className={styles.supportSection}>
            <li className={styles.menuItem} style={{ cursor: 'not-allowed', opacity: 0.6 }}>
              <CustomerServiceOutlined className={styles.supportIcon} />
              <span className={styles.supportText}>Soporte</span>
            </li>
          </div>
        </ul>
      </nav>

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
        <img
          src={logoEmpresa}
          alt="Logo Empresa"
          className={styles.logoEmpresa}
        />
      </div>
    </aside>
  );
};

export default MenuSidebar;
