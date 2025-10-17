/**
 * Custom hook for managing Shopify cart state using Server Actions
 * 
 * This hook provides a simplified client-side interface to cart operations
 * that are handled server-side, following SSR-first principles.
 */

'use client'

import { useState, useTransition, useOptimistic } from 'react';
import { addItemToCart, updateCartItemQuantity, removeCartItem, clearCartCookie } from '@/actions/cart';
import { Cart } from '@/types/shopify';

interface UseShopifyCartReturn {
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isPending: boolean;
  error: string | null;
}

export function useShopifyCart(): UseShopifyCartReturn {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  /**
   * Adds an item to the cart
   */
  const addItem = async (variantId: string, quantity = 1) => {
    setError(null);
    try {
      await addItemToCart(variantId, quantity);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Updates a cart item quantity
   */
  const updateItem = async (lineId: string, quantity: number) => {
    setError(null);
    try {
      await updateCartItemQuantity(lineId, quantity);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Removes an item from the cart
   */
  const removeItem = async (lineId: string) => {
    setError(null);
    try {
      await removeCartItem(lineId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Clears the cart
   */
  const clearCart = async () => {
    setError(null);
    try {
      await clearCartCookie();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isPending,
    error,
  };
}

