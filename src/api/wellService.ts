export interface WellData {
  depth: number;      // metros
  flowRate: number;   // litros/segundo
  volume: number;     // m³
  clientName: string; // nombre del cliente
}

export function fetchWellData(): Promise<WellData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error('Error al obtener datos del pozo.'));
        return;
      }
      resolve({
        depth: +(18 + Math.random() * 2).toFixed(2),
        flowRate: +(0.5 + Math.random() * 2).toFixed(2),
        volume: +(300 + Math.random() * 100).toFixed(3),
        clientName: 'Cliente Ejemplo',
      });
    }, 1000);
  });
} 