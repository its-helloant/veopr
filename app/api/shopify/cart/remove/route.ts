import { NextResponse } from 'next/server';
import { removeFromCart } from '@/lib/shopify';

/**
 * POST /api/shopify/cart/remove
 * Removes an item from the cart
 */
export async function POST(request: Request) {
  try {
    const { cartId, lineId } = await request.json();

    if (!cartId || !lineId) {
      return NextResponse.json(
        { error: 'Cart ID and line ID are required' },
        { status: 400 }
      );
    }

    const cart = await removeFromCart(cartId, lineId);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}

