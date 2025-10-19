/**
 * Server Actions for Cart Management
 * 
 * These server actions handle cart operations using cookies for persistence
 * instead of client-side localStorage, enabling SSR-compatible cart management.
 */

'use server'

import { cookies } from 'next/headers';
import { addToCart, getCart, updateCartLine, removeFromCart, createCart } from '@/lib/shopify';
import { Cart } from '@/types/shopify';
import { logger } from '@/lib/logger';

const CART_COOKIE = 'shopify_cart_id';

/**
 * Gets the cart ID from cookies
 */
async function getCartId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value || null;
}

/**
 * Sets the cart ID in cookies
 */
async function setCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

/**
 * Gets existing cart without creating a new one
 * Safe to call during rendering
 */
export async function getExistingCart(): Promise<Cart | null> {
  const cartId = await getCartId();
  
  if (!cartId) {
    return null;
  }
  
  const cart = await getCart(cartId);
  return cart;
}

/**
 * Gets existing cart or creates a new one
 * WARNING: Can only be called from Server Actions or Route Handlers
 */
export async function getOrCreateCart(): Promise<Cart> {
  let cartId = await getCartId();
  
  if (!cartId) {
    const newCart = await createCart();
    await setCartId(newCart.id);
    return newCart;
  }
  
  const cart = await getCart(cartId);
  if (!cart) {
    const newCart = await createCart();
    logger.warn(`No cart found for ${cartId}, created new cart: ${newCart.id}`);
    await setCartId(newCart.id);
    return newCart;
  }
  
  return cart;
}

/**
 * Adds an item to the cart
 */
export async function addItemToCart(variantId: string, quantity: number = 1): Promise<Cart> {
  const cart = await getOrCreateCart();
  const updatedCart = await addToCart(cart.id, variantId, quantity);
  return updatedCart;
}

/**
 * Updates the quantity of a cart item
 */
export async function updateCartItemQuantity(lineId: string, quantity: number): Promise<Cart> {
  const cart = await getOrCreateCart();
  const updatedCart = await updateCartLine(cart.id, lineId, quantity);
  return updatedCart;
}

/**
 * Removes an item from the cart
 */
export async function removeCartItem(lineId: string): Promise<Cart> {
  const cart = await getOrCreateCart();
  const updatedCart = await removeFromCart(cart.id, lineId);
  return updatedCart;
}

/**
 * Clears the cart by removing the cart cookie
 */
export async function clearCartCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}

