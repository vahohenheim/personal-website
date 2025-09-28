import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const useFixScrollTopInNavigation = () => {
  const pathname = usePathname();
  
  useEffect(() => { 
    window.scroll(0, 0);
  }, [pathname]);
}