import { useState, useEffect } from 'react';

export default function useHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    console.log('✅ useHydrated → hydrated')
    setIsHydrated(true);
  }, []);

  return isHydrated;
}