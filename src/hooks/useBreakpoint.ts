import { useState, useEffect } from 'react';

export function useBreakpoint() {
  const getBreakpoint = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return {
      isMobile: width < 1000,
      isTablet: width >= 1000 && width < 1200,
      isDesktop: width >= 1200,
      pozoScale: width < 600 ? 0.7 : width < 1000 ? 1.0 : 1.4,
    };
  };

  const [breakpoint, setBreakpoint] = useState(getBreakpoint());

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
} 