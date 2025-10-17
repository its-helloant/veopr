import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ButtonConfig {
  text: string;
  disabled: boolean;
  isLoading?: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAction: (product: Product) => void;
  buttonConfig: ButtonConfig;
}

export function ProductCard({
  product,
  viewMode,
  onAction,
  buttonConfig,
}: ProductCardProps) {
  const primaryImage = product.images?.[0] || null;

  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
        {/* Grid View */}
        <Link href={`/productos/${product.handle}`} className="block flex-grow flex flex-col">
          <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {primaryImage ? (
              <Image 
                src={primaryImage.url} 
                alt={primaryImage.alt || product.name}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
              </svg>
            )}
          </div>
          <div className="p-3 sm:p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h3>
              <p className="text-sm sm:text-base font-bold text-gray-900 ml-2">${product.price.toFixed(2)}</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex-grow line-clamp-2">{product.description}</p>
            {product.productType && (
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {product.productType}
                </span>
              </div>
            )}
          </div>
        </Link>
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 mt-auto">
          <button 
            onClick={() => onAction(product)}
            disabled={buttonConfig.disabled}
            className="w-full bg-blue-500 text-white touch-target rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            {buttonConfig.isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            )}
            <span>{buttonConfig.text}</span>
          </button>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex items-center p-3 sm:p-4">
      <Link href={`/productos/${product.handle}`} className="flex flex-grow items-center min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 sm:mr-4 overflow-hidden">
          {primaryImage ? (
            <Image 
              src={primaryImage.url} 
              alt={primaryImage.alt || product.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
            </svg>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 pr-2">{product.name}</h3>
            <p className="text-sm sm:text-base font-bold text-gray-900 flex-shrink-0">${product.price.toFixed(2)}</p>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-1">{product.description}</p>
          {product.productType && (
            <div className="flex justify-between items-center">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {product.productType}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="ml-2 sm:ml-4 flex-shrink-0">
        <button 
          onClick={() => onAction(product)}
          disabled={buttonConfig.disabled}
          className="bg-blue-500 text-white touch-target rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm font-medium px-3 sm:px-4 flex items-center justify-center gap-2"
        >
          {buttonConfig.isLoading && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
          )}
          <span>{buttonConfig.text}</span>
        </button>
      </div>
    </div>
  );
}

