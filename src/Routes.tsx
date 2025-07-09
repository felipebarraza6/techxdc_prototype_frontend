import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RecoverPasswordPage from "./pages/auth/RecoverPasswordPage";
import UserProfile from "./pages/UserProfile";
import AppLayout from "./components/layout/AppLayout";
// Clients
import ClientListPage from "./pages/clients/ClientListPage";
import ClientCreatePage from "./pages/clients/ClientCreatePage";
import ClientEditPage from "./pages/clients/ClientEditPage";

// Groups
import GroupListPage from "./pages/groups/GroupListPage";
import GroupCreatePage from "./pages/groups/GroupCreatePage";
import GroupEditPage from "./pages/groups/GroupEditPage";
import { HeaderActionsProvider } from "./context/HeaderActionsContext";

// Telemetry
import Telemetry from "./pages/telemetry/Telemetry";

// DGA
import DgaMEE from "./pages/dga/DGA_MEE";
import DGA_Analisis from "./pages/dga/DGA_Analisis";

// Smart Analysis
import SmartAnalysis from "./pages/smart-analysis/SmartAnalysis";

//Documents
import DocumentosPage from "./pages/documents/documents";

// Alerts
import AlertsPage from './pages/alerts/AlertsPage';
import AlertCreatePage from './pages/alerts/AlertCreatePage';
import SupportPage from './pages/support/SupportPage';
import { SelectedCatchmentPointProvider } from './context/SelectedCatchmentPointContext';


const ProtectedLayout: React.FC = () => (
  <HeaderActionsProvider>
    <SelectedCatchmentPointProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </SelectedCatchmentPointProvider>
  </HeaderActionsProvider>
);


const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (sin layout global) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />

        {/* Rutas protegidas (con layout global) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Clients */}
          <Route path="/clients" element={<ClientListPage />} />
          <Route path="/clients/create" element={<ClientCreatePage />} />
          <Route path="/clients/:id/edit" element={<ClientEditPage />} />
          
          {/* Groups */}
          <Route path="/groups" element={<GroupListPage />} />
          <Route path="/groups/create" element={<GroupCreatePage />} />
          <Route path="/groups/:id/edit" element={<GroupEditPage />} />
          
          {/* Perfil */}
          <Route path="/profile" element={<UserProfile />} />

          {/* Telemetría */}
          <Route path="/telemetry" element={<Telemetry />} />

          {/* Documentos */}
          <Route path="/documents" element={<DocumentosPage />} />
          
          {/* DGA */}
          <Route path="/dga" element={<DgaMEE />} />
          <Route path="/dga/analisis" element={<DGA_Analisis/>} />
          
          {/* Smart Analysis */}
          <Route path="/smart-analysis" element={<SmartAnalysis/>} />

          {/* Alertas y Soporte */}
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/create" element={<AlertCreatePage />} />
          <Route path="/support" element={<SupportPage />} />

        </Route>
        {/* 404 */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
