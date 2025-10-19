import { NextResponse } from 'next/server';
import { createCart, getCart } from '@/lib/shopify';
import { logger } from '@/lib/logger';

// Prevent static generation for API routes
export const dynamic = 'force-dynamic';

/**
 * POST /api/shopify/cart
 * Creates a new cart
 */
export async function POST() {
  try {
    const cart = await createCart();
    logger.info('New cart created', { cartId: cart.id });
    return NextResponse.json({ cart }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    logger.error('Failed to create cart', error);
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/shopify/cart?cartId=xxx
 * Retrieves an existing cart
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    const cart = await getCart(cartId);
    
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cart }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    logger.error('Failed to fetch cart', error, { cartId: new URL(request.url).searchParams.get('cartId') });
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

