'use client'

import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ProductSearchFilterProps {
  shows: string[];
  initialSearch: string;
  initialShow: string;
}

export default function ProductSearchFilter({ shows, initialSearch, initialShow }: ProductSearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedShow, setSelectedShow] = useState(initialShow);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`/productos?${params.toString()}`);
  };

  const handleShowFilter = (show: string) => {
    setSelectedShow(show);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (show !== 'all') {
      params.set('show', show);
    } else {
      params.delete('show');
    }
    router.push(`/productos?${params.toString()}`);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchStartY;
    
    if (typeof window !== 'undefined' && window.scrollY === 0 && touchDiff > 100 && !isRefreshing) {
      handleRefresh();
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  return (
    <>
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Pull to refresh indicator */}
        {isRefreshing && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg z-40 md:hidden">
            <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 margin-mobile">
          {/* Desktop Layout */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                inputMode="search"
                autoComplete="off"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filtros</span>
              {selectedShow !== 'all' && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">1</span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 whitespace-nowrap">Vista:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  aria-label="Vista de cuadrícula"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  aria-label="Vista de lista"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="relative margin-mobile">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-mobile-body"
                inputMode="search"
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="touch-target flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-mobile-body font-medium sm:justify-start"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filtros</span>
                {selectedShow !== 'all' && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">1</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <span className="text-mobile-body text-gray-600 mr-2">Vista:</span>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`touch-target ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                    aria-label="Vista de cuadrícula"
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`touch-target ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                    aria-label="Vista de lista"
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowFilters(false)}
            />
            
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 md:hidden">
              <div className="p-4">
                <div className="flex items-center justify-between margin-mobile">
                  <h3 className="text-mobile-h2 text-gray-900">Filtros</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="touch-target rounded-full hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-mobile-body font-medium text-gray-700 margin-mobile">Filtrar por programa:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {shows.map((show) => (
                      <button
                        key={show}
                        onClick={() => handleShowFilter(show)}
                        className={`touch-target px-3 py-2 rounded-lg text-mobile-body font-medium transition-colors ${
                          selectedShow === show
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {show === 'all' ? 'Todos' : show}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedShow !== 'all' && (
                  <button
                    onClick={() => handleShowFilter('all')}
                    className="w-full mt-4 py-2 text-blue-500 text-mobile-body font-medium"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Desktop Filter Options */}
        {showFilters && (
          <div className="hidden md:block bg-white rounded-lg shadow-sm border p-4 sm:p-6 margin-mobile">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por programa:</h3>
            <div className="flex flex-wrap gap-2">
              {shows.map((show) => (
                <button
                  key={show}
                  onClick={() => handleShowFilter(show)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedShow === show
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {show === 'all' ? 'Todos' : show}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expose view mode for parent component */}
      <input type="hidden" data-view-mode={viewMode} id="view-mode-state" />
    </>
  );
}

