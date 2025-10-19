/**
 * Cart Context Provider
 * Provides shared cart state across all components using Server Actions
 * 
 * This context uses a hybrid approach:
 * - Server-side persistence: Cart data is stored in cookies via Server Actions
 * - Client-side state: Manages UI state and optimistic updates for immediate feedback
 * 
 * Note: This must be a Client Component to use React Context and manage state,
 * but cart persistence is handled server-side for SSR compatibility.
 */

'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addItemToCart, updateCartItemQuantity, removeCartItem, clearCartCookie } from '@/actions/cart';
import { Cart } from '@/types/shopify';
import { logger } from '@/lib/logger';

interface CartContextType {
  cart: Cart | null;
  isPending: boolean;
  error: string | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  isAddingItem: (variantId: string) => boolean;
  updatingLineId: string | null;
  removingLineId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Recalculates cart totals based on current items
 */
function recalculateCartTotals(cart: Cart): Cart {
  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    ...cart,
    totalQuantity,
    subtotal,
    total: subtotal,
  };
}

export function CartProvider({ 
  children, 
  initialCart 
}: { 
  children: ReactNode;
  initialCart: Cart | null;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);
  const [removingLineId, setRemovingLineId] = useState<string | null>(null);
  const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(new Set());
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  /**
   * Adds an item to the cart with optimistic updates and request deduplication
   */
  const addItem = async (variantId: string, quantity = 1) => {
    // Request deduplication: prevent concurrent requests for the same variant
    if (pendingRequests.has(variantId)) {
      logger.warn(`Add to cart request for ${variantId} already in progress, ignoring duplicate`);
      return;
    }

    const originalCart = cart;
    setError(null);
    setIsPending(true);
    
    // Mark this request as pending
    setPendingRequests(prev => new Set(prev).add(variantId));

    try {
      // Note: We can't do full optimistic updates for addItem since we don't have 
      // the complete product data (image, name, price, etc.) client-side.
      // However, we can still prevent duplicate requests and handle state properly.
      
      const updatedCart = await addItemToCart(variantId, quantity);
      setCart(updatedCart);
    } catch (err) {
      // Rollback on error
      setCart(originalCart);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      setError(errorMessage);
      throw err;
    } finally {
      setIsPending(false);
      // Remove from pending requests
      setPendingRequests(prev => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }
  };

  /**
   * Updates a cart item quantity with optimistic UI and request deduplication
   */
  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return;

    // Request deduplication: prevent concurrent updates for the same line
    if (pendingUpdates.has(lineId)) {
      logger.warn(`Update cart request for line ${lineId} already in progress, ignoring duplicate`);
      return;
    }

    const originalCart = cart;
    setError(null);
    setUpdatingLineId(lineId);
    setPendingUpdates(prev => new Set(prev).add(lineId));

    try {
      // Optimistic update
      const optimisticCart = recalculateCartTotals({
        ...cart,
        items: cart.items.map(item => 
          item.id === lineId ? { ...item, quantity } : item
        ),
      });
      
      setCart(optimisticCart);

      const updatedCart = await updateCartItemQuantity(lineId, quantity);
      setCart(updatedCart);
    } catch (err) {
      // Rollback on error
      setCart(originalCart);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      throw err;
    } finally {
      setUpdatingLineId(null);
      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(lineId);
        return next;
      });
    }
  };

  /**
   * Removes an item from the cart with request deduplication
   * Note: NO optimistic update - item stays visible until server confirms removal
   */
  const removeItem = async (lineId: string) => {
    if (!cart) return;

    // Request deduplication: prevent concurrent removals for the same line
    if (pendingRemovals.has(lineId)) {
      logger.warn(`Remove cart request for line ${lineId} already in progress, ignoring duplicate`);
      return;
    }

    setError(null);
    setRemovingLineId(lineId);
    setPendingRemovals(prev => new Set(prev).add(lineId));

    try {
      // Wait for server response before updating UI
      const updatedCart = await removeCartItem(lineId);
      setCart(updatedCart);
    } catch (err) {
      // No rollback needed since we didn't do optimistic update
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      setError(errorMessage);
      throw err;
    } finally {
      setRemovingLineId(null);
      setPendingRemovals(prev => {
        const next = new Set(prev);
        next.delete(lineId);
        return next;
      });
    }
  };

  /**
   * Clears the cart
   */
  const clearCart = async () => {
    setError(null);
    try {
      await clearCartCookie();
      setCart(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Check if a specific variant is being added to cart
   */
  const isAddingItem = (variantId: string): boolean => {
    return pendingRequests.has(variantId);
  };

  const itemCount = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isPending,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        itemCount,
        isAddingItem,
        updatingLineId,
        removingLineId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

