'use client'

import { useState } from 'react';
import { HeartIcon, ShareIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface ProductOptionsProps {
  sizes: string[];
  colors: string[];
  price: number;
}

export default function ProductOptions({ sizes, colors, price }: ProductOptionsProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const addToCart = () => {
    console.log('Added to cart:', { selectedSize, selectedColor, quantity });
  };

  return (
    <>
      {/* Options */}
      <div className="space-y-4">
        {/* Size Selection */}
        {sizes.length > 1 && (
          <div>
            <h3 className="text-mobile-body font-medium text-gray-900 mb-2">Talla</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`touch-target px-3 sm:px-4 py-2 border rounded-lg text-mobile-body font-medium transition-colors ${
                    selectedSize === size
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {colors.length > 1 && (
          <div>
            <h3 className="text-mobile-body font-medium text-gray-900 mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`touch-target px-3 sm:px-4 py-2 border rounded-lg text-mobile-body font-medium transition-colors ${
                    selectedColor === color
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <h3 className="text-mobile-body font-medium text-gray-900 mb-2">Cantidad</h3>
          <div className="flex items-center border border-gray-300 rounded-lg w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="touch-target hover:bg-gray-50 transition-colors"
            >
              -
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center text-mobile-body">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="touch-target hover:bg-gray-50 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 sm:gap-4">
        <button 
          onClick={addToCart}
          className="flex-1 bg-blue-500 text-white touch-target rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-mobile-body font-medium"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Agregar al carrito</span>
          <span className="sm:hidden">Agregar</span>
        </button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="touch-target border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
          )}
        </button>
        <button className="touch-target border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <ShareIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
        </button>
      </div>

      {/* Sticky Add to Cart Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-900">${price}</div>
            <div className="text-sm text-gray-600">
              {selectedSize && `Talla: ${selectedSize} • `}
              {selectedColor && `Color: ${selectedColor} • `}
              Cantidad: {quantity}
            </div>
          </div>
          <button 
            onClick={addToCart}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Agregar
          </button>
        </div>
      </div>
    </>
  );
}

