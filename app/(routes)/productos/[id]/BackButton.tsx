'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="touch-target flex items-center gap-2 text-gray-600 hover:text-gray-900 margin-mobile transition-colors"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      <span className="text-mobile-body">Volver</span>
    </button>
  );
}

