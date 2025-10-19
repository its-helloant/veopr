/**
 * Product Types - Shopify Only
 */

export interface Product {
  id: string;
  handle: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: Array<{
    url: string;
    alt: string | null;
    width?: number;
    height?: number;
  }>;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  shopifyId: string;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    availableForSale: boolean;
    image?: {
      url: string;
      alt: string | null;
    };
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  }>;
}

// Helper to get the first variant ID for cart operations
export function getDefaultVariantId(product: Product): string | null {
  return product.variants?.[0]?.id || null;
}

