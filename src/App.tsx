import { ConfigProvider } from 'antd';
import './App.css';
import { UserProvider } from './context/UserState';
import { FormProvider } from './context/Form/FormContext';
import AppRouter from './Routes';

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
            <AppRouter />
          </div>
        </ConfigProvider>
      </FormProvider>
    </UserProvider>
  );
}

export default App;