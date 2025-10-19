import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/shopify';

// Revalidate every 15 minutes
export const revalidate = 900;

/**
 * GET /api/shopify/products
 * Fetches all products from Shopify
 */
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

