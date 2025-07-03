import { ConfigProvider } from 'antd';
import './App.css';
import { UserProvider } from './context/UserState';
import { FormProvider } from './context/Form/FormContext';
import AppRouter from './Routes';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <UserProvider>
      <FormProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              fontFamily: 'Roboto, Arial, sans-serif',
            },
          }}
        >
          <ErrorBoundary>
            <div className="app">
              <AppRouter />
            </div>
          </ErrorBoundary>
        </ConfigProvider>
      </FormProvider>
    </UserProvider>
  );
}

export default App;