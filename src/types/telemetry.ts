export interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  timestamp?: string;
  style?: React.CSSProperties;
} 