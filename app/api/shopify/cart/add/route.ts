import { NextResponse } from 'next/server';
import { addToCart } from '@/lib/shopify';
import { logger } from '@/lib/logger';

/**
 * POST /api/shopify/cart/add
 * Adds an item to the cart
 */
export async function POST(request: Request) {
  try {
    const { cartId, variantId, quantity } = await request.json();

    if (!cartId || !variantId) {
      logger.warn('Cart add request missing required fields', { cartId, variantId });
      return NextResponse.json(
        { error: 'Cart ID and variant ID are required' },
        { status: 400 }
      );
    }

    const cart = await addToCart(cartId, variantId, quantity > 0 ? quantity : 1);
    logger.info('Item added to cart successfully', { cartId, itemCount: cart.totalQuantity });
    return NextResponse.json({ cart }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    logger.error('Failed to add item to cart', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

