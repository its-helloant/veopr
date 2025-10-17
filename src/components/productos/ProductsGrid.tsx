import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ButtonConfig {
  text: string;
  disabled: boolean;
}

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  onProductAction: (product: Product) => void;
  getButtonConfig: (product: Product) => ButtonConfig;
}

export function ProductsGrid({
  products,
  loading,
  viewMode,
  onProductAction,
  getButtonConfig,
}: ProductsGridProps) {
  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <>
      {/* Results Count */}
      <div className="margin-mobile">
        <p className="text-mobile-body text-gray-600">
          {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Products Grid/List */}
      {products.length > 0 ? (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6' 
            : 'space-y-4'
        }`}>
          {products.map((product) => {
            const buttonConfig = getButtonConfig(product);
            
            return (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onAction={onProductAction}
                buttonConfig={buttonConfig}
              />
            );
          })}
        </div>
      ) : (
        /* No Results */
        <div className="text-center py-12">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto margin-mobile" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.095-5.583-2.709M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path>
          </svg>
          <h3 className="text-mobile-h2 text-gray-700 margin-mobile">No se encontraron productos</h3>
          <p className="text-mobile-body text-gray-500">Intenta ajustar tus filtros o términos de búsqueda</p>
        </div>
      )}
    </>
  );
}

