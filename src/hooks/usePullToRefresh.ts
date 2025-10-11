import { useState, useCallback } from 'react';

export function usePullToRefresh(refetch: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchStartY;
    
    // If user scrolled down from top and pulled down more than 100px
    if (typeof window !== 'undefined' && window.scrollY === 0 && touchDiff > 100 && !isRefreshing) {
      handleRefresh();
    }
  }, [touchStartY, isRefreshing]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  return {
    isRefreshing,
    handleTouchStart,
    handleTouchMove,
    handleRefresh,
  };
}



