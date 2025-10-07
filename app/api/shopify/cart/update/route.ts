import { NextResponse } from 'next/server';
import { updateCartLine } from '@/lib/shopify';

/**
 * POST /api/shopify/cart/update
 * Updates a cart line quantity
 */
export async function POST(request: Request) {
  try {
    const { cartId, lineId, quantity } = await request.json();

    if (!cartId || !lineId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart ID, line ID, and quantity are required' },
        { status: 400 }
      );
    }

    const cart = await updateCartLine(cartId, lineId, quantity);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

