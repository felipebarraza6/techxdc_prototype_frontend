import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const getIsMobile = () =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false;
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const handleResize = () => setIsMobile(getIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
} 