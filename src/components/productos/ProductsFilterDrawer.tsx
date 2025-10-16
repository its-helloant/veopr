import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProductsFilterDrawerProps {
  showFilters: boolean;
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onClose: () => void;
}

export function ProductsFilterDrawer({
  showFilters,
  categories,
  selectedCategory,
  onCategorySelect,
  onClose,
}: ProductsFilterDrawerProps) {
  if (!showFilters) return null;

  return (
    <>
      {/* Mobile Filter Drawer */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
        
        {/* Drawer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50">
          <div className="p-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between margin-mobile">
              <h3 className="text-mobile-h2 text-gray-900">Filtros</h3>
              <button
                onClick={onClose}
                className="touch-target rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            {/* Filter Content */}
            <div>
              <h4 className="text-mobile-body font-medium text-gray-700 margin-mobile">Filtrar por categoría:</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onCategorySelect(cat)}
                    className={`touch-target px-3 py-2 rounded-lg text-mobile-body font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {selectedCategory !== 'all' && (
              <button
                onClick={() => onCategorySelect('all')}
                className="w-full mt-4 py-2 text-blue-500 text-mobile-body font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Filter Options */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border p-4 sm:p-6 margin-mobile">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por categoría:</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
