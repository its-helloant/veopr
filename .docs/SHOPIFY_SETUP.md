# Shopify Integration Setup Guide

This guide will walk you through setting up the Shopify integration for your VeoPR website.

## Overview

Your VeoPR website is now integrated with the Latin Doctors Pharma Shopify store (latindoctorspharma.com). Users can browse products, add them to their cart, and checkout directly through Shopify's secure checkout process.

## Prerequisites

You need to create a Shopify Storefront API access token from your Shopify admin panel.

## Step 1: Create a Custom App in Shopify

1. Log in to your Shopify admin panel at: `https://latindoctorspharma.myshopify.com/admin`

2. Navigate to **Settings** → **Apps and sales channels**

3. Click **Develop apps** (you may need to enable custom app development first)

4. Click **Create an app**

5. Name your app (e.g., "VeoPR Website Integration")

6. Click **Create app**

## Step 2: Configure Storefront API Access

1. In your new app, go to the **Configuration** tab

2. Under **Storefront API**, click **Configure**

3. Enable the following Storefront API access scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`

4. Click **Save**

## Step 3: Install the App and Get Your Access Token

1. Go to the **API credentials** tab

2. Click **Install app** (this generates your access tokens)

3. Copy the **Storefront API access token** (it will look something like: `shpat_xxxxxxxxxxxxxxxxxxxxx`)

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)

2. Add the following environment variables:

```env
# Shopify Storefront API Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=latindoctorspharma.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

3. Replace `your_storefront_access_token_here` with the token you copied in Step 3

4. **IMPORTANT**: Make sure `.env.local` is in your `.gitignore` file to keep your credentials secure

## Step 5: Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## Features

### Product Browsing
- Browse all products from the Latin Doctors Pharma store
- Search products by name or description
- Filter products by category
- View products in grid or list layout
- Mobile-responsive design with pull-to-refresh

### Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- View cart total
- Persistent cart (saved in browser localStorage)

### Checkout
- Secure checkout through Shopify
- Users are redirected to Shopify's hosted checkout page
- All payment processing handled by Shopify

## API Endpoints

The integration includes the following API routes:

- `GET /api/shopify/products` - Fetch all products
- `GET /api/shopify/products/[handle]` - Fetch single product by handle
- `POST /api/shopify/cart` - Create a new cart
- `GET /api/shopify/cart?cartId=xxx` - Retrieve existing cart
- `POST /api/shopify/cart/add` - Add item to cart
- `POST /api/shopify/cart/update` - Update cart item quantity
- `POST /api/shopify/cart/remove` - Remove item from cart

## Custom Hooks

### useShopifyProducts()
Fetches and manages product data:
```typescript
const { products, loading, error, refetch } = useShopifyProducts();
```

### useShopifyProduct(handle)
Fetches a single product by handle:
```typescript
const { product, loading, error, refetch } = useShopifyProduct('product-handle');
```

### useShopifyCart()
Manages cart state:
```typescript
const { 
  cart, 
  loading, 
  error, 
  addItem, 
  updateItem, 
  removeItem, 
  clearCart, 
  itemCount 
} = useShopifyCart();
```

## Troubleshooting

### Products not loading?

1. Check that your environment variables are correctly set in `.env.local`
2. Verify your Storefront API access token is valid
3. Make sure you've restarted your development server after adding environment variables
4. Check the browser console for any error messages

### Cart not persisting?

The cart ID is stored in localStorage. Make sure:
1. Your browser allows localStorage
2. You're not in private/incognito mode
3. localStorage hasn't been cleared

### Checkout not working?

The checkout redirects to Shopify's hosted checkout. Make sure:
1. Your products are published and available for sale
2. Your Shopify store checkout settings are configured
3. The cart has at least one item

## Security Notes

- **NEVER** commit your `.env.local` file to version control
- The Storefront API tokens are public-facing (they start with `NEXT_PUBLIC_`)
- These tokens can only read public product data and create/manage carts
- They cannot access admin functionality or sensitive data
- All payment processing happens on Shopify's secure servers

## Need Help?

If you encounter any issues:

1. Check the Shopify Storefront API documentation: https://shopify.dev/docs/api/storefront
2. Review the error messages in your browser console
3. Check the Network tab in browser DevTools to see API responses
4. Verify your Shopify admin settings

## Next Steps

To customize the integration further:

1. Update product display in `app/(routes)/productos/Productos.tsx`
2. Customize the cart UI in `src/components/shared/ShoppingCart.tsx`
3. Add product detail pages
4. Implement additional filtering options
5. Add product recommendations
6. Integrate with analytics

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add your environment variables to your hosting platform's environment variable settings
2. Make sure both variables are set:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
3. Redeploy your application

The integration is production-ready and follows Next.js best practices for API routes, caching, and server-side rendering.

