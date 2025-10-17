import React from 'react';
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface ProductsSearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  selectedCategory: string;
  filterCount: number;
}

export function ProductsSearchBar({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onToggleFilters,
  filterCount,
}: ProductsSearchBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8">
      {/* Desktop Layout - Single row with search, filters, and view toggle */}
      <div className="hidden md:flex md:items-center md:gap-4">
        {/* Search Bar - Desktop */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            inputMode="search"
            autoComplete="off"
          />
        </div>

        {/* Filter Button - Desktop */}
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
        >
          <FunnelIcon className="h-5 w-5" />
          <span>Filtros</span>
          {filterCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{filterCount}</span>
          )}
        </button>

        {/* View Mode Toggle - Desktop */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 whitespace-nowrap">Vista:</span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              aria-label="Vista de cuadrícula"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              aria-label="Vista de lista"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Stacked */}
      <div className="md:hidden">
        {/* Search Bar - Mobile */}
        <div className="relative mb-4 sm:mb-6">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            inputMode="search"
            autoComplete="off"
          />
        </div>

        {/* Mobile Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
          {/* Filter Button - Mobile */}
          <button
            onClick={onToggleFilters}
            className="touch-target flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium sm:justify-start"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filtros</span>
            {filterCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{filterCount}</span>
            )}
          </button>

          {/* View Mode Toggle - Mobile */}
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="text-sm sm:text-base text-gray-600 mr-2">Vista:</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`touch-target ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                aria-label="Vista de cuadrícula"
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
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
  );
}
