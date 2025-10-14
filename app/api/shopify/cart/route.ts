import { NextResponse } from 'next/server';
import { createCart, getCart } from '@/lib/shopify';

/**
 * POST /api/shopify/cart
 * Creates a new cart
 */
export async function POST() {
  try {
    const cart = await createCart();
    return NextResponse.json({ cart }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error creating cart:', error);
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

    console.log('[API /cart GET] Fetching cart:', cartId);

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    const cart = await getCart(cartId);
    
    console.log('[API /cart GET] Cart retrieved:', cart);
    
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
    console.error('[API /cart GET] Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

