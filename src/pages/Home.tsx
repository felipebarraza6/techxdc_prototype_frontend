import { Typography } from 'antd';
import { useApi } from '../hooks';
import { useEffect, useState } from 'react';

const { Title } = Typography;

export const Home = () => {
  const { fetchData } = useApi();
  const [data, setData] = useState<{ userId: number; id: number; title: string; body: string }[] | null>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchExampleData = async () => {
      const result = await fetchData<{ userId: number; id: number; title: string; body: string }[]>('https://jsonplaceholder.typicode.com/posts');
      setData(result);
      console.log(result);
    };

    fetchExampleData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <Title>Welcome to the Application</Title>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Home;
