import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/shopify';

/**
 * GET /api/shopify/products
 * Fetches all products from Shopify
 */
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

