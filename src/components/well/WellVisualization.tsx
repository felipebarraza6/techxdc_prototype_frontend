import React from 'react';
import styles from './WellVisualization.module.css';
import { Typography, Spin } from 'antd';
import logoDatalogger from '../../assets/img/logo.jpg';

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

const WellVisualization: React.FC<{
  pozoBoxStyle?: React.CSSProperties;
  pozoScale?: number;
  error?: boolean;
  wellData?: any;
  loading?: boolean;
}> = ({ pozoBoxStyle = {}, pozoScale = 1.0, error = false, wellData = null, loading = false }) => {
  const [bubbles] = React.useState<Bubble[]>(generateRandomBubbles());
  const [tubeBubbles] = React.useState<Bubble[]>(generateRandomBubblesForTube());

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <svg width="22" height="22" viewBox="0 0 18 18" style={{ marginRight: 8, marginTop: 2 }}>
          <path d="M9 2C9 2 4 8.5 4 12A5 5 0 0 0 14 12C14 8.5 9 2 9 2Z" fill="none" stroke="#1C355F" strokeWidth="1.5" />
        </svg>
        <span className={styles.title}>Visualización del Pozo</span>
        {error && (
          <span className={styles.errorNotification}>Error al obtener datos del pozo</span>
        )}
      </div>
      <div className={styles.subtitle}>Representación en tiempo real del estado del pozo</div>
      <div
        className={styles.pozoBox}
        style={{ justifyContent: 'center', alignItems: 'center', ...pozoBoxStyle }}
      >
        <div
          className={styles.pozoScale}
          style={{ transform: `scale(${pozoScale})`, transformOrigin: 'center center' }}
        >
          <div className={styles.pozo + (error ? ' ' + styles.pozoError : '')}>
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
                <Text style={{ color: 'white' }}>{loading || error ? '--' : wellData ? `${wellData.depth.toFixed(2)} m` : '--'}</Text>
              </div>
            </div>
            <div className={styles.lineaLogger}></div>
            <div className={styles.lineaCaudalimetro}></div>
            <div className={styles.datalogger}>
              <div className={styles.tablero}>
                <img src={logoDatalogger} alt="Logo datalogger" className={styles.dataloggerLogo} />
                <center>
                  <Text className={styles.tableroText} style={{ color: 'black', fontWeight: 500, fontSize: '1.0em' }}>
                    {loading || error ? '--' : wellData ? wellData.volume.toLocaleString('es-CL', { maximumFractionDigits: 3 }) : '--'}
                    <br /> m³
                  </Text>
                </center>
              </div>
              <div className={styles.pataIzquierda}></div>
              <div className={styles.pataDerecha}></div>
            </div>
            <div className={styles.caudalimetro}>
              <Text className={styles.caudalimetroText}>
                {loading || error ? '--' : wellData ? `${wellData.flowRate.toFixed(2)} lt/s` : '--'}
              </Text>
            </div>
          </div>
        </div>
      </div>
      {loading && <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%' }} />}
    </div>
  );
};

export default WellVisualization;