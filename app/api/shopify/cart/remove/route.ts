import { NextResponse } from 'next/server';
import { removeFromCart } from '@/lib/shopify';
import { logger } from '@/lib/logger';

/**
 * POST /api/shopify/cart/remove
 * Removes an item from the cart
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, lineId } = body;

    if (!cartId || !lineId) {
      logger.warn('Cart remove request missing required fields', { cartId, lineId });
      return NextResponse.json(
        { error: 'Cart ID and line ID are required' },
        { status: 400 }
      );
    }

    const cart = await removeFromCart(cartId, lineId);
    logger.info('Item removed from cart successfully', { cartId, itemCount: cart.totalQuantity });
    
    return NextResponse.json({ cart }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    logger.error('Failed to remove item from cart', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}

