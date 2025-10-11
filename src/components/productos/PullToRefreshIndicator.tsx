import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface PullToRefreshIndicatorProps {
  isRefreshing: boolean;
}

export function PullToRefreshIndicator({ isRefreshing }: PullToRefreshIndicatorProps) {
  if (!isRefreshing) return null;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg z-40 md:hidden">
      <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin" />
    </div>
  );
}





