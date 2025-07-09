// Tipos para datos de pozo
export interface WellData {
  flowRate: number;
  depth: number;
  volume: number;
  clientName?: string;
  // Agrega aquí otros campos si los necesitas
}

export interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  timestamp?: string;
  style?: React.CSSProperties;
} 