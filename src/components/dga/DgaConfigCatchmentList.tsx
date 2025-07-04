import React, { useEffect } from 'react';
import { List, Button, Spin, Alert } from 'antd';
import { useDgaConfigCatchment } from '../../hooks/useDgaConfigCatchment';
import { useFormContext } from '../../hooks/useFormContext';

const DgaConfigCatchmentList: React.FC = () => {
  const { loading, error, dgaConfigs, getAllDgaConfigs, getDgaConfigById } = useDgaConfigCatchment();
  const { setFormData } = useFormContext();

  useEffect(() => {
    getAllDgaConfigs();
  }, []);

  const handleEdit = (id: number) => {
    getDgaConfigById(id).then((config) => {
      if (config) {
        setFormData(config);
      }
    });
  };

  if (loading) {
    return (
      <Spin tip="Loading...">
        <div />
      </Spin>
    );
  }

  if (error) {
    return <Alert message="Error fetching DGA configurations" type="error" />;
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={dgaConfigs}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button type="primary" onClick={() => handleEdit(item.id)}>
              Edit
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={`DGA Config ID: ${item.id}`}
            description={`Standard: ${item.standard}, Type: ${item.type_dga}`}
          />
        </List.Item>
      )}
    />
  );
};

export default DgaConfigCatchmentList;