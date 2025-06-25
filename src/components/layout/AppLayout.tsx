import React from "react";
import { Layout } from "antd";
import MenuSidebar from "./MenuSidebar";
import Header from "./Header";
import styles from "./AppLayout.module.css";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

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
  const header = headerMap[location.pathname] || { title: "", subtitle: "" };

  return (
    <Layout className={styles.appLayout}>
      <MenuSidebar className={styles.sidebar} />
      <Layout className={styles.mainLayout}>
        <Header title={header.title} subtitle={header.subtitle} />
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
