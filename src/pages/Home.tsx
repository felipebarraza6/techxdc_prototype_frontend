import { Typography } from 'antd';
import styles from './Home.module.css';

const { Title } = Typography;

export const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <Title>Dashboard</Title>
      <p>Este es el contenido de tu Dashboard. </p>
    </div>
  );
};

export default Home;