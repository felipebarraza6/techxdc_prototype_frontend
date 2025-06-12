import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RecoverPasswordPage from './pages/auth/RecoverPasswordPage';
import ClientListPage from './pages/clients/ClientListPage';
import ClientCreatePage from './pages/clients/ClientCreatePage';
import ClientEditPage from './pages/clients/ClientEditPage';
import GroupListPage from './pages/groups/GroupListPage';
import GroupCreatePage from './pages/groups/GroupCreatePage';
import GroupEditPage from './pages/groups/GroupEditPage';
import './App.css';
import { UserProvider } from './context/UserState';
import { FormProvider } from './context/Form/FormContext';

function App() {
  return (
    <UserProvider>
      <ConfigProvider
        theme={{
          token: {
            // You can customize your theme tokens here
            colorPrimary: '#1890ff',
          },
        }}
      >
        <div className="app">
          <Home />
        </div>
      </ConfigProvider>
    </UserProvider>
  );
}

export default App;