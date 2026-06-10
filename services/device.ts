
import { useState, useEffect } from 'react';

export const useDevice = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      // Check for screen width and touch capabilities
      const mobileWidth = window.innerWidth < 768;
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(mobileWidth || (touchSupport && window.innerWidth < 1024));
    };
    
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return { isMobile, isDesktop: !isMobile };
};
