import { useState, useEffect } from 'react';

export function useResponsivePozoScale() {
  const [pozoScale, setPozoScale] = useState(1.4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setPozoScale(0.7);
      } else if (window.innerWidth < 1000) {
        setPozoScale(1.0);
      } else {
        setPozoScale(1.4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return pozoScale;
} 