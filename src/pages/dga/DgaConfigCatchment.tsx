import React from 'react';
import { Layout, Typography } from 'antd';
import DgaConfigCatchmentForm from '../../components/dga/DgaConfigCatchmentForm';
import DgaConfigCatchmentList from '../../components/dga/DgaConfigCatchmentList';

const { Title } = Typography;
const { Content } = Layout;

const DgaConfigCatchment: React.FC = () => (
  <Layout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>DGA Config Catchment Management</Title>
        <DgaConfigCatchmentForm />
        <DgaConfigCatchmentList />
      </Content>
  </Layout>
);

export default DgaConfigCatchment;