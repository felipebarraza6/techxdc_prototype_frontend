import { ConfigProvider } from 'antd';
import Home from './pages/Home';
import './App.css';
import { UserProvider } from './context/UserState';
import { FormProvider } from './context/Form/FormContext';

function App() {
  return (
    <UserProvider>
      <FormProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
            },
          }}
        >
          <div className="app">
            <Home />
          </div>
        </ConfigProvider>
      </FormProvider>
    </UserProvider>
  );
}

export default App;