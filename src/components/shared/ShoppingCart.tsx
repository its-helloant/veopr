/**
 * Shopping Cart Component
 * Displays cart items and allows users to manage their cart
 */

'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import type { Cart, CartItem as CartItemType } from '@/types/shopify';
import { 
  XMarkIcon, 
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

// ==================== Types ====================

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItemProps {
  item: CartItemType;
  currency: string;
  isUpdating: boolean;
  isRemoving: boolean;
  onUpdateQuantity: (lineId: string, currentQuantity: number, change: number) => void;
  onRemove: (lineId: string) => void;
  onClose: () => void;
}

interface CartFooterProps {
  cart: Cart;
  isPending: boolean;
  onCheckout: () => void;
}

// ==================== Sub-Components ====================

/**
 * Loading spinner component
 */
function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-8 w-8';
  return (
    <div className="flex items-center justify-center h-full">
      <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClass}`} />
    </div>
  );
}

/**
 * Error message component
 */
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-600 font-medium">{message}</p>
    </div>
  );
}

/**
 * Empty cart state component
 */
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <ShoppingBagIcon className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Tu carrito está vacío
      </h3>
      <p className="text-gray-500 mb-4">
        Agrega productos para empezar a comprar
      </p>
      <Link
        href="/productos"
        onClick={onClose}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Ver Productos
      </Link>
    </div>
  );
}

/**
 * Product image component with fallback
 */
function ProductImage({ image, name }: { image?: CartItemType['image']; name: string }) {
  if (image) {
    return (
      <Image
        src={image.url}
        alt={image.alt || name}
        width={80}
        height={80}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01" />
      </svg>
    </div>
  );
}

/**
 * Quantity controls component
 */
function QuantityControls({
  quantity,
  lineId,
  isUpdating,
  isProcessing,
  onUpdate,
}: {
  quantity: number;
  lineId: string;
  isUpdating: boolean;
  isProcessing: boolean;
  onUpdate: (lineId: string, currentQuantity: number, change: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={() => onUpdate(lineId, quantity, -1)}
        disabled={quantity <= 1 || isProcessing}
        className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Disminuir cantidad"
      >
        <MinusIcon className="h-4 w-4 text-gray-600" />
      </button>
      
      <span className="w-8 text-center text-sm font-medium flex items-center justify-center">
        {isUpdating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
        ) : (
          quantity
        )}
      </span>
      
      <button
        onClick={() => onUpdate(lineId, quantity, 1)}
        disabled={isProcessing}
        className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Aumentar cantidad"
      >
        <PlusIcon className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}

/**
 * Individual cart item component
 */
function CartItem({ 
  item, 
  currency, 
  isUpdating, 
  isRemoving, 
  onUpdateQuantity, 
  onRemove,
  onClose 
}: CartItemProps) {
  const isProcessing = isUpdating || isRemoving;
  const shouldShowVariant = item.variantTitle !== 'Default Title';

  return (
    <div 
      className={`flex gap-4 p-3 bg-gray-50 rounded-lg transition-all duration-200 ${
        isRemoving ? 'opacity-60 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
        <ProductImage image={item.image} name={item.name} />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/productos/${item.productHandle}`}
          onClick={onClose}
          className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
        >
          {item.name}
        </Link>
        
        {shouldShowVariant && (
          <p className="text-sm text-gray-500">{item.variantTitle}</p>
        )}
        
        <p className="text-sm font-semibold text-gray-900 mt-1">
          ${item.price.toFixed(2)} {currency}
        </p>

        {/* Controls Row */}
        <div className="flex items-center gap-2 mt-2">
          <QuantityControls
            quantity={item.quantity}
            lineId={item.id}
            isUpdating={isUpdating}
            isProcessing={isProcessing}
            onUpdate={onUpdateQuantity}
          />
          
          <button
            onClick={() => onRemove(item.id)}
            disabled={isProcessing}
            className="ml-auto p-1 hover:bg-red-100 rounded disabled:cursor-not-allowed transition-colors flex items-center justify-center w-6 h-6"
            aria-label="Eliminar producto"
          >
            {isRemoving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
            ) : (
              <TrashIcon className="h-4 w-4 text-red-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Cart footer with totals and checkout button
 */
function CartFooter({ cart, isPending, onCheckout }: CartFooterProps) {
  return (
    <div className="border-t p-4 space-y-4">
      {/* Subtotal */}
      <div className="flex justify-between text-base">
        <span className="text-gray-600">Subtotal:</span>
        <span className="font-medium text-gray-900">
          ${cart.subtotal.toFixed(2)} {cart.currency}
        </span>
      </div>

      {/* Total */}
      <div className="flex justify-between text-lg font-semibold">
        <span className="text-gray-900">Total:</span>
        <span className="text-gray-900">
          ${cart.total.toFixed(2)} {cart.currency}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isPending}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Proceder al Pago
      </button>

      <p className="text-xs text-gray-500 text-center">
        Los impuestos y envío se calculan en el checkout
      </p>
    </div>
  );
}

/**
 * Cart header component
 */
function CartHeader({ itemCount, onClose }: { itemCount: number; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <ShoppingBagIcon className="h-6 w-6 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">
          Carrito ({itemCount})
        </h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Cerrar carrito"
      >
        <XMarkIcon className="h-6 w-6 text-gray-500" />
      </button>
    </div>
  );
}

// ==================== Main Component ====================

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { 
    cart, 
    isPending, 
    updateItem, 
    removeItem, 
    itemCount, 
    error, 
    updatingLineId, 
    removingLineId 
  } = useCart();

  const handleUpdateQuantity = async (
    lineId: string, 
    currentQuantity: number, 
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    
    try {
      await updateItem(lineId, newQuantity);
    } catch (error) {
      // Error feedback handled by UI state
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    try {
      await removeItem(lineId);
    } catch (error) {
      // Error feedback handled by UI state
    }
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  // Early return for closed state
  if (!isOpen) return null;

  const isLoading = isPending && !cart;
  const isEmpty = !isPending && (!cart || cart.items.length === 0);
  const hasItems = cart && cart.items.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <CartHeader itemCount={itemCount} onClose={onClose} />

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && <ErrorMessage message={error} />}
          
          {isLoading && <LoadingSpinner />}
          
          {isEmpty && <EmptyCart onClose={onClose} />}
          
          {hasItems && (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  currency={cart.currency}
                  isUpdating={updatingLineId === item.id}
                  isRemoving={removingLineId === item.id}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {hasItems && (
          <CartFooter 
            cart={cart} 
            isPending={isPending} 
            onCheckout={handleCheckout} 
          />
        )}
      </div>
    </>
  );
}
