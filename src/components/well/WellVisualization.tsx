import React from 'react';
import styles from './WellVisualization.module.css';


const WellVisualization: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.header}>
      <svg width="22" height="22" viewBox="0 0 18 18" style={{ marginRight: 8, marginTop: 2 }}><path d="M9 2C9 2 4 8.5 4 12A5 5 0 0 0 14 12C14 8.5 9 2 9 2Z" fill="none" stroke="#1C355F" strokeWidth="1.5"/></svg>
      <span className={styles.title}>Visualización del Pozo</span>
    </div>
    <div className={styles.subtitle}>Representación en tiempo real del estado del pozo</div>
    <div style={{ width: 320, height: 220, background: '#e5e7eb', borderRadius: 16, margin: '40px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: 22, fontFamily: 'Roboto, Arial, sans-serif' }}>
      Pozo (placeholder)
    </div>
  </div>
);

export default WellVisualization;