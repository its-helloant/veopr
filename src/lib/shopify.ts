/**
 * Shopify Storefront API Client
 * 
 * This module provides functions to interact with the Shopify Storefront API
 * using GraphQL queries.
 */

import { 
  ShopifyProduct, 
  ShopifyCart, 
  Product, 
  Cart, 
  CartItem 
} from '@/types/shopify';
import { logger } from './logger';

// Access environment variables - these are public client-side variables
// Next.js replaces process.env.NEXT_PUBLIC_* at build time
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2025-10/graphql.json`;

/**
 * Makes a GraphQL request to Shopify Storefront API
 * @param query - GraphQL query string
 * @param variables - Query variables
 * @param options - Fetch options including caching strategy
 */
async function shopifyFetch<T>(
  query: string, 
  variables: Record<string, any> = {},
  options: { cache?: boolean } = { cache: true }
): Promise<T> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    logger.error('Shopify credentials not configured');
    throw new Error('Shopify credentials are not configured');
  }

  try {
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    };

    // Only cache product queries, never cache cart operations
    if (options.cache) {
      fetchOptions.next = { 
        revalidate: 3600, // Cache for 1 hour (3600 seconds)
        tags: ['shopify', 'products'] // Tags for on-demand revalidation
      };
    } else {
      // Explicitly disable caching for cart operations
      fetchOptions.cache = 'no-store';
    }

    const response = await fetch(SHOPIFY_GRAPHQL_URL, fetchOptions);

    if (!response.ok) {
      logger.error('Shopify API request failed', null, { 
        status: response.status, 
        statusText: response.statusText 
      });
      throw new Error(`Shopify API error ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      logger.error('Shopify GraphQL errors', null, { errors: json.errors });
      throw new Error('GraphQL errors occurred');
    }

    return json.data;
  } catch (error) {
    logger.error('Shopify fetch failed', error);
    throw error;
  }
}

/**
 * Normalizes a Shopify product to our app's Product type
 */
function normalizeProduct(shopifyProduct: ShopifyProduct): Product {
  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    compareAtPrice: shopifyProduct.variants.edges[0]?.node.compareAtPrice
      ? parseFloat(shopifyProduct.variants.edges[0].node.compareAtPrice.amount)
      : undefined,
    currency: shopifyProduct.priceRange.minVariantPrice.currencyCode,
    images: shopifyProduct.images.edges.map(({ node }) => ({
      url: node.url,
      alt: node.altText,
      width: node.width,
      height: node.height,
    })),
    availableForSale: shopifyProduct.availableForSale,
    variants: shopifyProduct.variants.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      price: parseFloat(node.price.amount),
      compareAtPrice: node.compareAtPrice ? parseFloat(node.compareAtPrice.amount) : undefined,
      availableForSale: node.availableForSale,
      image: node.image ? {
        url: node.image.url,
        alt: node.image.altText,
      } : undefined,
      selectedOptions: node.selectedOptions,
    })),
    tags: shopifyProduct.tags,
    productType: 'Latin Doctors', // Override all Shopify products to show "Latin Doctors" category
    vendor: shopifyProduct.vendor,
  };
}

/**
 * Normalizes a Shopify cart to our app's Cart type
 */
function normalizeCart(shopifyCart: ShopifyCart): Cart {
  return {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    items: shopifyCart.lines.edges.map(({ node }) => ({
      id: node.id,
      variantId: node.merchandise.id,
      productId: node.merchandise.product.handle,
      name: node.merchandise.product.title,
      variantTitle: node.merchandise.title,
      price: parseFloat(node.merchandise.price.amount),
      quantity: node.quantity,
      image: node.merchandise.image ? {
        url: node.merchandise.image.url,
        alt: node.merchandise.image.altText,
      } : undefined,
      productHandle: node.merchandise.product.handle,
    })),
    subtotal: parseFloat(shopifyCart.cost.subtotalAmount.amount),
    total: parseFloat(shopifyCart.cost.totalAmount.amount),
    totalQuantity: shopifyCart.totalQuantity,
    currency: shopifyCart.cost.totalAmount.currencyCode,
  };
}

/**
 * Fetches all products from the store
 */
export async function getAllProducts(first = 250): Promise<Product[]> {
  const query = `
    query getAllProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            descriptionHtml
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
            tags
            productType
            vendor
          }
        }
      }
    }
  `;

  const { products } = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
    query,
    { first }
  );

  return products.edges.map(({ node }) => normalizeProduct(node));
}

/**
 * Fetches a single product by handle
 */
export async function getProduct(handle: string): Promise<Product | null> {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        descriptionHtml
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
        tags
        productType
        vendor
      }
    }
  `;

  const { product } = await shopifyFetch<{ product: ShopifyProduct | null }>(
    query,
    { handle }
  );

  return product ? normalizeProduct(product) : null;
}

/**
 * Creates a new cart
 */
export async function createCart(): Promise<Cart> {
  logger.shopify('Creating new cart');
  const query = `
    mutation createCart {
      cartCreate {
        cart {
          id
          checkoutUrl
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          totalQuantity
        }
      }
    }
  `;

  const { cartCreate } = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>(query, {}, { cache: false });
  return normalizeCart(cartCreate.cart);
}

/**
 * Adds items to a cart
 */
export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
  logger.shopify('Adding item to cart', { cartId, variantId, quantity });
  const query = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          totalQuantity
        }
      }
    }
  `;

  const { cartLinesAdd } = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(
    query,
    {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
    { cache: false }
  );

  return normalizeCart(cartLinesAdd.cart);
}

/**
 * Updates cart line quantity
 */
export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  logger.shopify('Updating cart line', { cartId, lineId, quantity });
  const query = `
    mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          totalQuantity
        }
      }
    }
  `;

  const { cartLinesUpdate } = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>(
    query,
    {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    { cache: false }
  );

  return normalizeCart(cartLinesUpdate.cart);
}

/**
 * Removes a line from the cart
 */
export async function removeFromCart(cartId: string, lineId: string): Promise<Cart> {
  logger.shopify('Removing item from cart', { cartId, lineId });
  const query = `
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          totalQuantity
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(
    query,
    {
      cartId,
      lineIds: [lineId],
    },
    { cache: false }
  );

  return normalizeCart(response.cartLinesRemove.cart);
}

/**
 * Retrieves an existing cart by ID
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                  image {
                    url
                    altText
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        totalQuantity
      }
    }
  `;

  try {
    const { cart } = await shopifyFetch<{ cart: ShopifyCart | null }>(query, { cartId }, { cache: false });
    return cart ? normalizeCart(cart) : null;
  } catch (error) {
    logger.error('Failed to get cart', error, { cartId });
    return null;
  }
}

