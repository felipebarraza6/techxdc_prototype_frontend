import React, { useEffect, useState } from "react";
import styles from "./WellVisualization.module.css";
import { Typography } from "antd";
import { useBreakpoint } from '../../hooks/useBreakpoint';

const { Text } = Typography;

interface Bubble {
  size: string;
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  key?: string | number;
  yStart?: number;
  yEnd?: number;
}

interface WellProps {
  total: number;
  nivel: number | string;
  caudal: number | string;
  profW: number | string;
}

interface TubeBubble {
  size: string;
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
  key?: string | number;
}

const generateRandomBubbles = (): Bubble[] => {
  const bubbles: Bubble[] = [];
  const positions = new Set<string>();

  for (let i = 0; i < 20; i++) {
    let top: string, left: string;
    do {
      top = Math.random() * 100 + "%";
      left = Math.random() * 100 + "%";
    } while (positions.has(top + "-" + left));

    positions.add(top + "-" + left);

    const size: string = Math.random() * 5 + 2 + "px"; // Size between 2px and 7px
    const animationDuration: string = Math.random() * 5 + 5 + "s";
    const animationDelay: string = Math.random() * -10 + "s";

    bubbles.push({ 
      size, 
      top, 
      left, 
      animationDuration, 
      animationDelay, 
      key: `bubble-${i}-${Math.random()}`,
      yStart: 0,
      yEnd: -20
    });
  }

  return bubbles;
};

const generateRandomBubblesForTube = (): TubeBubble[] => {
  const bubbles: TubeBubble[] = [];

  for (let i = 0; i < 20; i++) {
    const size: string = Math.random() * 5 + 2 + "px"; // Size between 2px and 7px
    const left: string = Math.random() * 100 + "%";
    const top: string = Math.random() * 70 + "%"; // Generar top aleatorio entre 0% y 70%
    const animationDuration: string = Math.random() * 5 + 5 + "s";
    const animationDelay: string = Math.random() * -10 + "s";

    bubbles.push({ 
      size, 
      left, 
      top, 
      animationDuration, 
      animationDelay, 
      key: `tube-bubble-${i}-${Math.random()}`
    });
  }

  return bubbles;
};

const Well: React.FC<WellProps> = ({ total, nivel, caudal, profW }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [tubeBubbles, setTubeBubbles] = useState<TubeBubble[]>([]);
  const [niveLevel, setNivelLevel] = useState<number | string>(nivel);
  const [prof, setProf] = useState<number | string>(profW);
  const { pozoScale } = useBreakpoint();

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
        <div className={styles["tubo-pozo"]}>
          <div style={nivelStyle} className={styles.nivel} key="nivel">
            {tubeBubbles.map((bubble, index) => (
              <div
                key={index}
                className={styles["burbuja-tubo"]}
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  left: bubble.left,
                  top: bubble.top,
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
          <Text style={{ color: "white" }}>
            {nivel && parseFloat(String(nivel)).toFixed(2)} m
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
          {caudal && parseFloat(String(caudal)).toFixed(2)} lt/s
        </Text>
      </div>
    </div>
  );
};

export default Well;
