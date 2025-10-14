/**
 * Cart Context Provider
 * Provides shared cart state across all components
 */

'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart } from '@/types/shopify';

const CART_ID_KEY = 'shopify_cart_id';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Gets the cart ID from localStorage
   */
  const getCartId = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CART_ID_KEY);
  }, []);

  /**
   * Saves the cart ID to localStorage
   */
  const saveCartId = useCallback((cartId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_ID_KEY, cartId);
  }, []);

  /**
   * Creates a new cart
   */
  const createCart = useCallback(async (): Promise<Cart> => {
    console.log('[CartContext] Creating new cart...');
    const response = await fetch('/api/shopify/cart', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to create cart');
    }

    const data = await response.json();
    const newCart = data.cart;
    
    console.log('[CartContext] New cart created:', newCart.id);
    saveCartId(newCart.id);
    setCart(newCart);
    
    return newCart;
  }, [saveCartId]);

  /**
   * Fetches an existing cart
   */
  const fetchCart = useCallback(async (cartId: string): Promise<Cart | null> => {
    try {
      console.log('[CartContext] Fetching cart:', cartId);
      const response = await fetch(`/api/shopify/cart?cartId=${encodeURIComponent(cartId)}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('[CartContext] Cart not found, creating new one');
          return await createCart();
        }
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      console.log('[CartContext] Cart fetched:', data.cart);
      setCart(data.cart);
      return data.cart;
    } catch (err) {
      console.error('[CartContext] Error fetching cart:', err);
      return await createCart();
    }
  }, [createCart]);

  /**
   * Initializes the cart on mount
   */
  useEffect(() => {
    const initCart = async () => {
      const cartId = getCartId();
      
      if (cartId) {
        await fetchCart(cartId);
      }
    };

    initCart();
  }, [getCartId, fetchCart]);

  /**
   * Adds an item to the cart
   */
  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    console.log('[CartContext] Adding item:', variantId, 'quantity:', quantity);
    
    try {
      setLoading(true);
      setError(null);

      let currentCart = cart;
      
      if (!currentCart) {
        console.log('[CartContext] No cart exists, creating new cart...');
        currentCart = await createCart();
      }

      console.log('[CartContext] Adding to cart:', currentCart.id);

      const response = await fetch('/api/shopify/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: currentCart.id,
          variantId,
          quantity,
        }),
      });

      console.log('[CartContext] Add response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[CartContext] Add error:', errorData);
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      console.log('[CartContext] Cart updated:', data.cart);
      setCart(data.cart);
    } catch (err) {
      console.error('[CartContext] Error adding to cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart, createCart]);

  /**
   * Updates a cart item quantity
   */
  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;

    const originalCart = cart;

    try {
      setError(null);

      // Optimistic update
      const optimisticCart = {
        ...cart,
        items: cart.items.map(item => 
          item.id === lineId ? { ...item, quantity } : item
        ),
        totalQuantity: cart.items.reduce((sum, item) => 
          sum + (item.id === lineId ? quantity : item.quantity), 0
        ),
      };
      
      const newSubtotal = optimisticCart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      optimisticCart.subtotal = newSubtotal;
      optimisticCart.total = newSubtotal;
      
      console.log('[CartContext] Optimistic update for quantity');
      setCart(optimisticCart);

      const response = await fetch('/api/shopify/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: cart.id,
          lineId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      const data = await response.json();
      console.log('[CartContext] Cart updated from server');
      setCart(data.cart);
    } catch (err) {
      console.error('[CartContext] Error updating cart:', err);
      setCart(originalCart);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  }, [cart]);

  /**
   * Removes an item from the cart
   */
  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) {
      console.log('[CartContext] No cart found');
      return;
    }

    console.log('[CartContext] Removing item:', lineId);

    const originalCart = cart;

    try {
      setError(null);

      // Optimistic update
      const optimisticCart = {
        ...cart,
        items: cart.items.filter(item => item.id !== lineId),
        totalQuantity: cart.items
          .filter(item => item.id !== lineId)
          .reduce((sum, item) => sum + item.quantity, 0),
      };
      
      const newSubtotal = optimisticCart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      optimisticCart.subtotal = newSubtotal;
      optimisticCart.total = newSubtotal;
      
      console.log('[CartContext] Optimistic removal');
      setCart(optimisticCart);

      const response = await fetch('/api/shopify/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: cart.id,
          lineId,
        }),
      });

      console.log('[CartContext] Remove response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[CartContext] Remove error:', errorData);
        throw new Error('Failed to remove item from cart');
      }

      const data = await response.json();
      console.log('[CartContext] Cart updated from server');
      setCart(data.cart);
    } catch (err) {
      console.error('[CartContext] Error removing from cart:', err);
      setCart(originalCart);
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      throw err;
    }
  }, [cart]);

  /**
   * Clears the cart from local storage
   */
  const clearCart = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_ID_KEY);
    setCart(null);
  }, []);

  const itemCount = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
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

