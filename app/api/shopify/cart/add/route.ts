import { NextResponse } from 'next/server';
import { addToCart } from '@/lib/shopify';

/**
 * POST /api/shopify/cart/add
 * Adds an item to the cart
 */
export async function POST(request: Request) {
  try {
    const { cartId, variantId, quantity } = await request.json();

    if (!cartId || !variantId) {
      return NextResponse.json(
        { error: 'Cart ID and variant ID are required' },
        { status: 400 }
      );
    }

    const cart = await addToCart(cartId, variantId, quantity > 0 ? quantity : 1);
    return NextResponse.json({ cart }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

