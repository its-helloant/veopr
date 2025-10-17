import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify';

// Revalidate every 15 minutes
export const revalidate = 900;

/**
 * GET /api/shopify/products/[handle]
 * Fetches a single product by handle
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const product = await getProduct(handle);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

