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

interface CartContextType {
  cart: Cart | null;
  isPending: boolean;
  error: string | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
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

  /**
   * Adds an item to the cart
   */
  const addItem = async (variantId: string, quantity = 1) => {
    setError(null);
    setIsPending(true);
    try {
      const updatedCart = await addItemToCart(variantId, quantity);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      setError(errorMessage);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  /**
   * Updates a cart item quantity with optimistic UI
   */
  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return;

    const originalCart = cart;
    setError(null);

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
    }
  };

  /**
   * Removes an item from the cart with optimistic UI
   */
  const removeItem = async (lineId: string) => {
    if (!cart) return;

    const originalCart = cart;
    setError(null);

    try {
      // Optimistic update
      const optimisticCart = recalculateCartTotals({
        ...cart,
        items: cart.items.filter(item => item.id !== lineId),
      });
      
      setCart(optimisticCart);

      const updatedCart = await removeCartItem(lineId);
      setCart(updatedCart);
    } catch (err) {
      // Rollback on error
      setCart(originalCart);
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
      setCart(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    }
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

