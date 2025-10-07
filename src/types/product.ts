/**
 * Unified Product Types
 * Supports both Shopify and custom products
 */

export type ProductSource = 'shopify' | 'custom' | 'affiliate' | 'other';

export interface BaseProduct {
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
  source: ProductSource; // Identifies where this product comes from
}

export interface ShopifyProductData extends BaseProduct {
  source: 'shopify';
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

export interface CustomProductData extends BaseProduct {
  source: 'custom' | 'affiliate' | 'other';
  // For custom products, we can have different purchase options
  purchaseOptions: {
    type: 'external_link' | 'contact_form' | 'shopify_redirect' | 'custom';
    url?: string; // For external links or redirects
    buttonText?: string; // Custom button text
    contactEmail?: string; // For contact form
    customData?: Record<string, any>; // Flexible for future needs
  };
  // Optional fields for custom products
  sku?: string;
  stock?: number;
  metadata?: Record<string, any>;
}

// Unified product type that can be either Shopify or Custom
export type Product = ShopifyProductData | CustomProductData;

// Type guards to check product source
export function isShopifyProduct(product: Product): product is ShopifyProductData {
  return product.source === 'shopify';
}

export function isCustomProduct(product: Product): product is CustomProductData {
  return product.source === 'custom' || product.source === 'affiliate' || product.source === 'other';
}

// Helper to get the first variant ID for cart operations
export function getDefaultVariantId(product: Product): string | null {
  if (isShopifyProduct(product)) {
    return product.variants[0]?.id || null;
  }
  return null; // Custom products don't have Shopify variants
}

// Helper to determine if product can be added to Shopify cart
export function canAddToShopifyCart(product: Product): boolean {
  return isShopifyProduct(product) && product.availableForSale;
}

// Helper to get purchase action for a product
export function getPurchaseAction(product: Product): {
  type: 'add_to_cart' | 'external_link' | 'contact' | 'custom';
  data?: any;
} {
  if (isShopifyProduct(product)) {
    return { type: 'add_to_cart' };
  }
  
  const customProduct = product as CustomProductData;
  switch (customProduct.purchaseOptions.type) {
    case 'external_link':
      return { 
        type: 'external_link', 
        data: { 
          url: customProduct.purchaseOptions.url,
          buttonText: customProduct.purchaseOptions.buttonText || 'Ver Producto'
        } 
      };
    case 'contact_form':
      return { 
        type: 'contact', 
        data: { 
          email: customProduct.purchaseOptions.contactEmail,
          buttonText: customProduct.purchaseOptions.buttonText || 'Contactar'
        } 
      };
    default:
      return { 
        type: 'custom', 
        data: customProduct.purchaseOptions 
      };
  }
}

