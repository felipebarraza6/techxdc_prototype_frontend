import React from "react";
import { Layout } from "antd";
import AppHeader from "./Header";
import MenuSidebar from "./MenuSidebar";
import styles from "./AppLayout.module.css";
import { useNavigate } from "react-router-dom";
import { projectService } from "../../api/projectService";
import type { Project } from "../../api/projectService";
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useHeaderActions } from '../../context/HeaderActionsContext';
import { SelectedProjectProvider, useSelectedProject } from '../../context/SelectedProjectContext';
import { useSelectedCatchmentPoint } from '../../context/SelectedCatchmentPointContext';

const { Content } = Layout;

const AppLayoutInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const { selectedProject, setSelectedProject } = useSelectedProject();
  const { selectedCatchmentPoint } = useSelectedCatchmentPoint();
  const { isMobile } = useBreakpoint();
  const { headerActions } = useHeaderActions();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    projectService.getAll().then((data) => {
      setProjects(data);
    });
  }, []);

  const handleMenuClick = () => {
    setDrawerOpen(true);
  };

  return (
    <Layout className={styles.appLayout}>
      <MenuSidebar
        isMobile={isMobile}
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        onSupportClick={() => navigate("/support")}
        drawerOpen={drawerOpen}
        onDrawerClose={() => setDrawerOpen(false)}
        onMenuItemClick={() => setDrawerOpen(false)}
      />
      <Layout className={styles.mainLayout} style={{ marginLeft: isMobile ? 0 : 237 }}>
        <AppHeader
          selectedProject={selectedProject}
          selectedCatchmentPoint={selectedCatchmentPoint}
          headerActions={headerActions}
          isMobile={isMobile}
          onMenuClick={handleMenuClick}
        />
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
