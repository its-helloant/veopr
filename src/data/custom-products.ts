/**
 * Custom Products Data Source
 * 
 * This file contains non-Shopify products that are managed locally.
 * In the future, this could be replaced with a CMS, database, or API.
 */

import { CustomProductData } from '@/types/product';

export const customProducts: CustomProductData[] = [
  // Example: External affiliate product
  // {
  //   id: 'custom-001',
  //   handle: 'example-external-product',
  //   name: 'External Product Example',
  //   description: 'This product links to an external website',
  //   price: 29.99,
  //   currency: 'USD',
  //   images: [
  //     {
  //       url: '/images/example-product.jpg',
  //       alt: 'Example Product',
  //       width: 800,
  //       height: 800,
  //     }
  //   ],
  //   availableForSale: true,
  //   tags: ['external', 'affiliate'],
  //   productType: 'Affiliate',
  //   vendor: 'External Vendor',
  //   source: 'affiliate',
  //   purchaseOptions: {
  //     type: 'external_link',
  //     url: 'https://example.com/product',
  //     buttonText: 'Ver en Tienda Externa'
  //   },
  //   sku: 'EXT-001',
  // },

  // Example: Contact-based product
  // {
  //   id: 'custom-002',
  //   handle: 'consulting-service',
  //   name: 'Servicio de Consultoría',
  //   description: 'Servicio personalizado - contacta para más información',
  //   price: 0,
  //   currency: 'USD',
  //   images: [
  //     {
  //       url: '/images/consulting.jpg',
  //       alt: 'Consulting Service',
  //     }
  //   ],
  //   availableForSale: true,
  //   tags: ['service', 'consulting'],
  //   productType: 'Service',
  //   vendor: 'VeoPR',
  //   source: 'custom',
  //   purchaseOptions: {
  //     type: 'contact_form',
  //     contactEmail: 'info@veopr.com',
  //     buttonText: 'Solicitar Información'
  //   }
  // },
];

/**
 * Fetches custom products
 * This simulates an API call but reads from local data
 * In production, this could fetch from a CMS or database
 */
export async function getCustomProducts(): Promise<CustomProductData[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return customProducts;
}

/**
 * Fetches a single custom product by handle
 */
export async function getCustomProduct(handle: string): Promise<CustomProductData | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const product = customProducts.find(p => p.handle === handle);
  return product || null;
}

/**
 * Adds a custom product (for future admin interface)
 * This is a placeholder for when you implement a CMS or admin panel
 */
export async function addCustomProduct(product: Omit<CustomProductData, 'id'>): Promise<CustomProductData> {
  // In production, this would save to a database
  const newProduct: CustomProductData = {
    ...product,
    id: `custom-${Date.now()}`,
  };
  
  customProducts.push(newProduct);
  return newProduct;
}

/**
 * Updates a custom product
 */
export async function updateCustomProduct(id: string, updates: Partial<CustomProductData>): Promise<CustomProductData | null> {
  const index = customProducts.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  customProducts[index] = {
    ...customProducts[index],
    ...updates,
  };
  
  return customProducts[index];
}

/**
 * Deletes a custom product
 */
export async function deleteCustomProduct(id: string): Promise<boolean> {
  const index = customProducts.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  customProducts.splice(index, 1);
  return true;
}

