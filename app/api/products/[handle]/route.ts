import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';

/**
 * GET /api/products/[handle]
 * Fetches a single product by handle from any source
 */
export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const product = await getProduct(params.handle);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

