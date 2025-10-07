/**
 * Custom hook for managing Shopify cart state
 */

import { useState, useEffect, useCallback } from 'react';
import { Cart } from '@/types/shopify';

const CART_ID_KEY = 'shopify_cart_id';

interface UseShopifyCartReturn {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
  itemCount: number;
}

export function useShopifyCart(): UseShopifyCartReturn {
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
    const response = await fetch('/api/shopify/cart', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to create cart');
    }

    const data = await response.json();
    const newCart = data.cart;
    
    saveCartId(newCart.id);
    setCart(newCart);
    
    return newCart;
  }, [saveCartId]);

  /**
   * Fetches an existing cart
   */
  const fetchCart = useCallback(async (cartId: string): Promise<Cart | null> => {
    try {
      const response = await fetch(`/api/shopify/cart?cartId=${encodeURIComponent(cartId)}`);

      if (!response.ok) {
        if (response.status === 404) {
          // Cart not found, create a new one
          return await createCart();
        }
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCart(data.cart);
      return data.cart;
    } catch (err) {
      console.error('Error fetching cart:', err);
      // If cart fetch fails, create a new one
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
    try {
      setLoading(true);
      setError(null);

      let currentCart = cart;
      
      // Create cart if it doesn't exist
      if (!currentCart) {
        currentCart = await createCart();
      }

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

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      console.error('Error adding to cart:', err);
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

    try {
      setLoading(true);
      setError(null);

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
      setCart(data.cart);
    } catch (err) {
      console.error('Error updating cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart]);

  /**
   * Removes an item from the cart
   */
  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;

    try {
      setLoading(true);
      setError(null);

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

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      throw err;
    } finally {
      setLoading(false);
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

  return {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    itemCount,
  };
}

