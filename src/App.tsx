import { ConfigProvider, App as AntdApp } from 'antd';
import { UserProvider } from './context/UserState';
import { FormProvider } from './context/Form/FormContext';
import AppRouter from './Routes';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    // Envolvemos toda la app con <App> de Ant Design para que los mensajes funcionen correctamente
    <AntdApp>
      <UserProvider>
        <FormProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#568E2B',
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
    </AntdApp>
  );
}

export default App;