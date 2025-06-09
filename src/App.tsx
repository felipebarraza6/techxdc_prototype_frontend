import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RecoverPasswordPage from './pages/auth/RecoverPasswordPage';
import ClientListPage from './pages/clients/ClientListPage';
import ClientCreatePage from './pages/clients/ClientCreatePage';
import ClientEditPage from './pages/clients/ClientEditPage';
import './App.css';
import { UserProvider } from './context/UserState';

function App() {
  return (
    <UserProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/recover-password" element={<RecoverPasswordPage />} />
              <Route path="/clients" element={<ClientListPage />} />
              <Route path="/clients/create" element={<ClientCreatePage />} />
              <Route path="/clients/:id/edit" element={<ClientEditPage />} />
              {/* Redirección para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
    </UserProvider>
  );
}

export default App;