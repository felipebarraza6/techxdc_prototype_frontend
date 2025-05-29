import { ConfigProvider } from 'antd';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
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
  );
}

export default App;
