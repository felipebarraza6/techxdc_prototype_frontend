import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UserProfile from "./pages/UserProfile";
// Descomentar cuando se implemente la autenticación
// import PrivateRoute from "./components/PrivateRoute"; 

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* <PrivateRoute> // Descomentar cuando se implemente la autenticación */}
        <Route
          path="/dashboard"
          element={<h1>Aqui Rutas Privadas como Dashboard, Perfil, etc.</h1>}
        />
        <Route
          path="/profile"
          element={
              <UserProfile />
          }
        />
        {/* </PrivateRoute> // Descomentar cuando se implemente la autenticación */} 
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
