import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/shopify';

// Prevent static generation for API routes
export const dynamic = 'force-dynamic';

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

