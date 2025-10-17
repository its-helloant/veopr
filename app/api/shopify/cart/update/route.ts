import { NextResponse } from 'next/server';
import { updateCartLine } from '@/lib/shopify';
import { logger } from '@/lib/logger';

/**
 * POST /api/shopify/cart/update
 * Updates a cart line quantity
 */
export async function POST(request: Request) {
  try {
    const { cartId, lineId, quantity } = await request.json();

    if (!cartId || !lineId || quantity === undefined || quantity < 1) {
      return NextResponse.json(
        { error: 'Cart ID, line ID, and quantity are required' },
        { status: 400 }
      );
    }

    const cart = await updateCartLine(cartId, lineId, quantity);
    return NextResponse.json({ cart }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    logger.error('Failed to update cart', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

