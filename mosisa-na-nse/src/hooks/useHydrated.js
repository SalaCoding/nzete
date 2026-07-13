import { useState, useEffect } from 'react';

export default function useHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
  console.log('✅ useHydrated → hydrated');
  setTimeout(() => setIsHydrated(true), 0);
}, []);

  return isHydrated;
}