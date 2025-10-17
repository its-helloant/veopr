/**
 * Products API - Shopify Integration
 */

import { Product } from '@/types/product';
import { getAllProducts as getShopifyProducts, getProduct as getShopifyProduct } from './shopify';
import { Product as ShopifyProductType } from '@/types/shopify';

/**
 * Converts a Shopify product to the unified product type
 */
function convertShopifyProduct(shopifyProduct: ShopifyProductType): Product {
  return {
    ...shopifyProduct,
    shopifyId: shopifyProduct.id,
  };
}

/**
 * Fetches all products from Shopify
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const shopifyProducts = await getShopifyProducts();
    return shopifyProducts.map(convertShopifyProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetches a single product by handle from Shopify
 */
export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const shopifyProduct = await getShopifyProduct(handle);
    if (shopifyProduct) {
      return convertShopifyProduct(shopifyProduct);
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Gets all unique product types
 */
export function getAllProductTypes(products: Product[]): string[] {
  const types = new Set(products.map(p => p.productType).filter(Boolean));
  return Array.from(types).sort();
}

/**
 * Gets all unique vendors
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

