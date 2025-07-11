import React, { useEffect, useState } from "react";
import styles from "./WellVisualization.module.css";
import { Typography } from "antd";
import { motion } from "framer-motion";
import { useBreakpoint } from '../../hooks/useBreakpoint';

const { Text } = Typography;

interface Bubble {
  size: string;
  top?: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  key: number;
}

interface WellProps {
  total: number;
  nivel: number | string;
  caudal: number | string;
  profW: number | string;
}

const BUBBLE_COUNT = 20;

const generateRandomBubbles = (): Bubble[] => {
  const bubbles: Bubble[] = [];
  const positions = new Set<string>();
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    let top: string, left: string;
    do {
      top = Math.random() * 100 + "%";
      left = Math.random() * 100 + "%";
    } while (positions.has(`${top}-${left}`));
    positions.add(`${top}-${left}`);
    const size = Math.random() * 5 + 2 + "px";
    const animationDuration = (Math.random() * 2 + 3).toFixed(2) + "s";
    const animationDelay = (Math.random() * 2).toFixed(2) + "s";
    bubbles.push({ size, top, left, animationDuration, animationDelay, key: i + Math.random() });
  }
  return bubbles;
};

const generateRandomBubblesForTube = (): Bubble[] => {
  const bubbles: Bubble[] = [];
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    const size = Math.random() * 5 + 2 + "px";
    const left = Math.random() * 100 + "%";
    const animationDuration = (Math.random() * 2 + 3).toFixed(2) + "s";
    const animationDelay = (Math.random() * 2).toFixed(2) + "s";
    bubbles.push({ size, left, animationDuration, animationDelay, key: i + Math.random() });
  }
  return bubbles;
};

const Well: React.FC<WellProps> = ({ total, nivel, caudal, profW }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [tubeBubbles, setTubeBubbles] = useState<Bubble[]>([]);
  const [niveLevel, setNivelLevel] = useState<number | string>(nivel);
  const [prof, setProf] = useState<number | string>(profW);
  const { isDesktop, pozoScale } = useBreakpoint();

  // Para reiniciar burbujas periódicamente y simular ciclo
  useEffect(() => {
    setBubbles(generateRandomBubbles());
    setTubeBubbles(generateRandomBubblesForTube());
    setNivelLevel(nivel);
    if (typeof profW === 'number' ? profW <= 0 : parseFloat(profW) <= 0) {
      setProf(50);
    } else {
      setProf(profW);
    }
    const interval = setInterval(() => {
      setBubbles(generateRandomBubbles());
      setTubeBubbles(generateRandomBubblesForTube());
    }, 4000);
    return () => clearInterval(interval);
  }, [nivel, profW]);

  const currentProf = typeof prof === 'number' ? prof : parseFloat(prof);
  const currentNivel = typeof niveLevel === 'number' ? niveLevel : parseFloat(niveLevel);

  const waterHeight = currentProf - currentNivel;
  let percentage = (waterHeight / currentProf) * 100;
  percentage = Math.max(0, Math.min(100, percentage));
  const percentageString = percentage.toFixed(2) + "%";

  const nivelStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "0",
    width: "100%",
    height: percentageString,
    borderRadius: "0px 0px 10px 10px",
    backgroundColor: "#8aafb1",
    backgroundSize: "cover",
    animation: "ondulacion-nivel 2s infinite",
  };

  return (
    <div
      className={styles.pozo}
      style={{ transform: `scale(${pozoScale})`, transformOrigin: 'center' }}
    >
      <div className={styles.superficie}></div>
      <div className={styles.pavimento}></div>
      <div className={styles["nivel-agua"]}>
        <div className={styles.tierra}></div>
        <div className={styles["agua-inferior"]}>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.key}
              className={styles.burbuja}
              style={{
                width: bubble.size,
                height: bubble.size,
                left: bubble.left,
                top: bubble.top,
                position: 'absolute',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 0.7, 0], y: [-10, -40, -80, -120] }}
              transition={{
                duration: parseFloat(bubble.animationDuration),
                delay: parseFloat(bubble.animationDelay),
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <div className={styles["tubo-pozo"]}>
          <div style={nivelStyle} className={styles.nivel} key="nivel">
            {tubeBubbles.map((bubble) => (
              <motion.div
                key={bubble.key}
                className={styles["burbuja-tubo"]}
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  left: bubble.left,
                  position: 'absolute',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 0.7, 0], y: [-10, -30, -60, -100] }}
                transition={{
                  duration: parseFloat(bubble.animationDuration),
                  delay: parseFloat(bubble.animationDelay),
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.sensor}>
        <div className={styles.punta}>
          <Text style={{ color: "white" }}>
            {nivel && parseFloat(nivel as string).toFixed(2)} m
          </Text>
        </div>
      </div>
      <div className={styles["linea-logger"]}></div>
      <div className={styles["linea-caudalimetro"]}></div>
      <div className={styles.datalogger}>
        <div className={styles.tablero}>
          <center>
            <Text
              style={{
                color: "black",
                fontWeight: "500",
                fontSize: "1.0em",
              }}
            >
              {total && total.toLocaleString("es-CL")} m³
            </Text>
          </center>
        </div>
        <div className={styles["pata-izquierda"]}></div>
        <div className={styles["pata-derecha"]}></div>
      </div>
      <div className={styles.caudalimetro}>
        <Text style={{ textAlign: "center", color: "white" }}>
          {caudal && parseFloat(caudal as string).toFixed(2)} lt/s
        </Text>
      </div>
    </div>
  );
};

export default Well;
