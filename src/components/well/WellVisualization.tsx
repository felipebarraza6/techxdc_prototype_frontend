import React, { useEffect, useState } from 'react';
import styles from './WellVisualization.module.css';
import { fetchWellData } from '../../api/wellService';
import type { WellData } from '../../api/wellService';
import { Typography, Spin } from 'antd';
import logoDGA from '../../assets/img/dganuevo.jpg';
import logoIKOLU from '../../assets/img/logoikolu.png';

const { Text } = Typography;

interface Bubble {
  size: string;
  top?: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}

const generateRandomBubbles = (): Bubble[] => {
  const bubbles: Bubble[] = [];
  const positions = new Set();
  for (let i = 0; i < 20; i++) {
    let top, left;
    do {
      top = Math.random() * 100 + '%';
      left = Math.random() * 100 + '%';
    } while (positions.has(`${top}-${left}`));
    positions.add(`${top}-${left}`);
    const size = Math.random() * 5 + 2 + 'px';
    const animationDuration = Math.random() * 5 + 5 + 's';
    const animationDelay = Math.random() * -10 + 's';
    bubbles.push({ size, top, left, animationDuration, animationDelay });
  }
  return bubbles;
};

const generateRandomBubblesForTube = (): Bubble[] => {
  const bubbles: Bubble[] = [];
  for (let i = 0; i < 20; i++) {
    const size = Math.random() * 5 + 2 + 'px';
    const left = Math.random() * 100 + '%';
    const animationDuration = Math.random() * 5 + 5 + 's';
    const animationDelay = Math.random() * -10 + 's';
    bubbles.push({ size, left, animationDuration, animationDelay });
  }
  return bubbles;
};

const WellVisualization: React.FC = () => {
  const [wellData, setWellData] = useState<WellData | null>(null);
  const [loading, setLoading] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [tubeBubbles, setTubeBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchWellData()
      .then(data => { setWellData(data); setLoading(false); })
      .catch(() => setLoading(false));
    setBubbles(generateRandomBubbles());
    setTubeBubbles(generateRandomBubblesForTube());
  }, []);

  return (
    <div className={styles.pozoContainer}>
      <div className={styles.pozo}>
        <div className={styles.superficie}></div>
        <div className={styles.pavimento}></div>
        <div className={styles.nivelAgua}>
        <div className={styles.tierra}></div>
          <div className={styles.aguaInferior}>
            {bubbles.map((bubble, index) => (
              <div
                key={index}
                className={styles.burbuja}
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  top: bubble.top,
                  left: bubble.left,
                  animationDuration: bubble.animationDuration,
                  animationDelay: bubble.animationDelay,
                }}
              ></div>
            ))}
          </div>
          <div className={styles.tuboPozo}>
            <div className={styles.nivel}>
              {tubeBubbles.map((bubble, index) => (
                <div
                  key={index}
                  className={styles.burbujaTubo}
                  style={{
                    width: bubble.size,
                    height: bubble.size,
                    left: bubble.left,
                    animationDuration: bubble.animationDuration,
                    animationDelay: bubble.animationDelay,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.sensor}>
          <div className={styles.punta}>
            <Text style={{ color: 'white' }}>{loading || !wellData ? '--' : `${wellData.depth.toFixed(2)} m`}</Text>
          </div>
        </div>
        <div className={styles.lineaLogger}></div>
        <div className={styles.lineaCaudalimetro}></div>
        <div className={styles.datalogger}>
          <div className={styles.tablero}>
            <center>
              <Text style={{ color: 'black', fontWeight: 500, fontSize: '1.0em' }}>
                {loading || !wellData ? '--' : wellData.volume.toLocaleString('es-CL', { maximumFractionDigits: 3 })}
                <br /> m³
              </Text>
            </center>
          </div>
          <div className={styles.pataIzquierda}></div>
          <div className={styles.pataDerecha}></div>
        </div>
        <div className={styles.transmisionContainer}>
          <div className={styles.transmisionRow}>
            <img src={logoDGA} alt="DGA" className={styles.logoPlataforma} />
            <div className={styles.linea}></div>
          </div>
          <div className={styles.transmisionRow}>
            <img src={logoIKOLU} alt="IKOLU" className={styles.logoPlataforma} />
            <div className={styles.linea}></div>
          </div>
        </div>
        <div className={styles.caudalimetro}>
          <Text className={styles.caudalimetroText}>
            {loading || !wellData ? '--' : `${wellData.flowRate.toFixed(2)} lt/s`}
          </Text>
        </div>
      </div>
      {loading && <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%' }} />}
    </div>
  );
};

export default WellVisualization;