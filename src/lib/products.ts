/**
 * Unified Products API
 * Combines products from multiple sources (Shopify, custom, etc.)
 */

import { Product, ShopifyProductData, CustomProductData } from '@/types/product';
import { getAllProducts as getShopifyProducts, getProduct as getShopifyProduct } from './shopify';
import { getCustomProducts, getCustomProduct } from '@/data/custom-products';
import { Product as ShopifyProductType } from '@/types/shopify';

/**
 * Converts a Shopify product to the unified product type
 */
function convertShopifyProduct(shopifyProduct: ShopifyProductType): ShopifyProductData {
  return {
    ...shopifyProduct,
    source: 'shopify',
    shopifyId: shopifyProduct.id,
  };
}

/**
 * Fetches all products from all sources
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Fetch from all sources in parallel
    const [shopifyProducts, customProducts] = await Promise.allSettled([
      getShopifyProducts().catch(() => []),
      getCustomProducts().catch(() => []),
    ]);

    const allProducts: Product[] = [];

    // Add Shopify products
    if (shopifyProducts.status === 'fulfilled') {
      allProducts.push(...shopifyProducts.value.map(convertShopifyProduct));
    }

    // Add custom products
    if (customProducts.status === 'fulfilled') {
      allProducts.push(...customProducts.value);
    }

    return allProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetches a single product by handle from any source
 */
export async function getProduct(handle: string): Promise<Product | null> {
  try {
    // Try Shopify first
    const shopifyProduct = await getShopifyProduct(handle).catch(() => null);
    if (shopifyProduct) {
      return convertShopifyProduct(shopifyProduct);
    }

    // Try custom products
    const customProduct = await getCustomProduct(handle).catch(() => null);
    if (customProduct) {
      return customProduct;
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Filters products by source
 */
export function filterProductsBySource(products: Product[], source: Product['source']): Product[] {
  return products.filter(p => p.source === source);
}

/**
 * Gets all unique product types across all sources
 */
export function getAllProductTypes(products: Product[]): string[] {
  const types = new Set(products.map(p => p.productType).filter(Boolean));
  return Array.from(types).sort();
}

/**
 * Gets all unique vendors across all sources
 */
export function getAllVendors(products: Product[]): string[] {
  const vendors = new Set(products.map(p => p.vendor).filter(Boolean));
  return Array.from(vendors).sort();
}

/**
 * Searches products by name or description
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

