import { NextResponse } from 'next/server';
import { removeFromCart } from '@/lib/shopify';

/**
 * POST /api/shopify/cart/remove
 * Removes an item from the cart
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, lineId } = body;

    if (!cartId || !lineId) {
      console.error('[API /cart/remove] Missing required fields:', { cartId, lineId });
      return NextResponse.json(
        { error: 'Cart ID and line ID are required' },
        { status: 400 }
      );
    }

    const cart = await removeFromCart(cartId, lineId);
    console.log('[API /cart/remove] Cart after removal:', cart);
    
    return NextResponse.json({ cart }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('[API /cart/remove] Error:', error);
    if (error instanceof Error) {
      console.error('[API /cart/remove] Error message:', error.message);
      console.error('[API /cart/remove] Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to remove item from cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

