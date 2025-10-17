/**
 * Type definitions for Next.js environment variables
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Public client-side variables
      NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?: string;
      NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
      
      // Add other environment variables here as needed
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};

