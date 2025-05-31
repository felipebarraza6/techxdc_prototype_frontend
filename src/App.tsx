import { ConfigProvider } from 'antd';
import Home from './pages/Home';
import './App.css';
import { UserProvider } from './context/UserState';

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
