import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RecoverPasswordPage from "./pages/auth/RecoverPasswordPage";
import UserProfile from "./pages/UserProfile";

// Catchment
import CatchmentPointListPage from "./pages/catchment/CatchmentPointListPage";
import CatchmentPointCreatePage from "./pages/catchment/CatchmentPointCreatePage";
import CatchmentPointEditPage from "./pages/catchment/atchmentPointEditPage";

// Clients
import ClientListPage from "./pages/clients/ClientListPage";
import ClientCreatePage from "./pages/clients/ClientCreatePage";
import ClientEditPage from "./pages/clients/ClientEditPage";

// Groups
import GroupListPage from "./pages/groups/GroupListPage";
import GroupCreatePage from "./pages/groups/GroupCreatePage";
import GroupEditPage from "./pages/groups/GroupEditPage";


const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home & Auth */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />

        {/* Perfil */}
        <Route path="/profile" element={<UserProfile />} />

        {/* Catchment Points */}
        <Route path="/catchment" element={<CatchmentPointListPage />} />
        <Route path="/catchment/new" element={<CatchmentPointCreatePage />} />
        <Route path="/catchment/:id/edit" element={<CatchmentPointEditPage />} />

        {/* Clients */}
        <Route path="/clients" element={<ClientListPage />} />
        <Route path="/clients/create" element={<ClientCreatePage />} />
        <Route path="/clients/:id/edit" element={<ClientEditPage />} />

        {/* Groups */}
        <Route path="/groups" element={<GroupListPage />} />
        <Route path="/groups/create" element={<GroupCreatePage />} />
        <Route path="/groups/:id/edit" element={<GroupEditPage />} />

  
        {/* 404 */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;