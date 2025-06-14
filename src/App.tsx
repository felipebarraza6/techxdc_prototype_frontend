import { ConfigProvider } from 'antd';
import Home from './pages/Home';
import './App.css';
import { UserProvider } from './context/UserState';
import { FormProvider } from './context/Form/FormContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatchmentPointList from './pages/TestUseCatchmentPoint';

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
          {/* <div className="app">
            <Home />
          </div> */}
          <Router>
            <div className="app">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catchments" element={<CatchmentPointList />} />
              </Routes>
            </div>
          </Router>
        </ConfigProvider>
      </FormProvider>
    </UserProvider>
  );
}

export default App;