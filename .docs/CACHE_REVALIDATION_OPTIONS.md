# Cache Revalidation Options for VeoPR

## Current Cache Setup ⚙️

Products from Shopify are now cached for **1 hour (3600 seconds)** at the fetch level. This significantly improves performance by reducing API calls to Shopify and speeding up page loads.

**Configuration:**
```typescript
// src/lib/shopify.ts
next: { 
  revalidate: 3600, // Cache for 1 hour
  tags: ['shopify', 'products'] // Tags for selective cache invalidation
}
```

**Benefits:**
- ✅ **Fast load times** - Products served from cache
- ✅ **Reduced API calls** - Up to 60x fewer Shopify API requests
- ✅ **Lower costs** - Reduced bandwidth and API usage
- ✅ **Better UX** - Near-instant page loads

**Trade-off:**
- ⚠️ New products or changes may take up to 1 hour to appear on the website

---

## Why Manual Revalidation Matters 🔄

When you add/update products in Shopify, you want them to appear on your website immediately without waiting for the 1-hour cache to expire. Here are your options:

---

## Option 1: Shopify Webhooks (Automatic) 🤖

### **Best For:** Production environments, automated real-time updates

### **How It Works:**
1. You configure webhooks in Shopify Admin
2. When a product is created/updated, Shopify sends a POST request to your website
3. Your API route verifies the request and clears the product cache
4. Next request fetches fresh data from Shopify

### **Implementation Steps:**

#### Step 1: Create the Revalidation API Route

Create `app/api/revalidate/products/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Get the webhook secret from environment
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('SHOPIFY_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify the request is from Shopify
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    const body = await request.text();
    
    const hash = crypto
      .createHmac('sha256', webhookSecret)
      .update(body, 'utf8')
      .digest('base64');
    
    if (hash !== hmacHeader) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Clear the product cache
    revalidateTag('products');
    revalidateTag('shopify');
    
    console.log('✅ Product cache revalidated via webhook');
    
    return NextResponse.json({ 
      revalidated: true, 
      timestamp: new Date().toISOString() 
    });
    
  } catch (error) {
    console.error('Error in webhook revalidation:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

// Allow webhook to bypass middleware if needed
export const runtime = 'nodejs';
```

#### Step 2: Add Webhook Secret to Environment

Add to `.env.local`:
```env
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret_here
```

#### Step 3: Configure Shopify Webhooks

1. **Go to Shopify Admin:**
   - Navigate to: `Settings` → `Notifications` → `Webhooks`

2. **Create Product Creation Webhook:**
   - Click "Create webhook"
   - Event: `Product creation`
   - Format: `JSON`
   - URL: `https://yourdomain.com/api/revalidate/products`
   - API version: `2025-10` (latest)
   - Click "Save"

3. **Create Product Update Webhook:**
   - Click "Create webhook"
   - Event: `Product update`
   - Format: `JSON`
   - URL: `https://yourdomain.com/api/revalidate/products`
   - API version: `2025-10` (latest)
   - Click "Save"

4. **Get Webhook Secret:**
   - After creating webhooks, Shopify will show you a webhook signing secret
   - Copy this and add it to your `.env.local` file

#### Step 4: Test the Webhook

1. In Shopify Admin, go to your webhook settings
2. Click on a webhook you created
3. Scroll to "Recent events"
4. Create/update a test product
5. Verify the webhook was delivered successfully

### **Pros:**
- ✅ Fully automatic - no manual intervention needed
- ✅ Real-time updates - products appear immediately
- ✅ Secure - HMAC signature verification
- ✅ Production-ready - handles all product changes

### **Cons:**
- ❌ Requires public URL (doesn't work on localhost without tunneling)
- ❌ Slightly more complex setup
- ❌ Requires webhook secret management

### **Cost:** Free

---

## Option 2: Admin Dashboard Button 🔘

### **Best For:** Small teams, manual control, development environments

### **How It Works:**
1. You create a protected admin page/component
2. Add a "Refresh Products" button
3. Clicking it clears the cache via an API route
4. Next request fetches fresh data

### **Implementation Steps:**

#### Step 1: Create Admin Revalidation Route

Create `app/api/admin/revalidate/products/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Clear the product cache
    revalidateTag('products');
    revalidateTag('shopify');
    
    console.log('✅ Product cache manually revalidated');
    
    return NextResponse.json({ 
      success: true,
      revalidated: true,
      timestamp: new Date().toISOString() 
    });
    
  } catch (error) {
    console.error('Error in manual revalidation:', error);
    return NextResponse.json(
      { success: false, error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
```

#### Step 2: Add to Your Admin Dashboard

Create or update your admin component:

```tsx
// app/admin/page.tsx (or wherever your admin panel is)
'use client'

import { useState } from 'react';

export default function AdminPanel() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const refreshProducts = async () => {
    setIsRefreshing(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/revalidate/products', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Products cache cleared! Fresh data will load on next page view.');
      } else {
        setMessage('❌ Failed to refresh products.');
      }
    } catch (error) {
      setMessage('❌ Error refreshing products.');
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <h2 className="text-lg font-semibold mb-2">Product Cache</h2>
        <p className="text-gray-600 text-sm mb-4">
          Clear the product cache to fetch the latest products from Shopify.
        </p>
        
        <button
          onClick={refreshProducts}
          disabled={isRefreshing}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Products'}
        </button>
        
        {message && (
          <p className="mt-4 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}
```

#### Step 3: Protect the Admin Route (Optional but Recommended)

Add authentication middleware to protect the admin routes:

```typescript
// middleware.ts (in project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // TODO: Add your authentication logic here
    // Example: Check for admin session/token
    // const token = request.cookies.get('admin-token');
    // if (!token) return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

### **Pros:**
- ✅ Simple to implement
- ✅ Works in development (localhost)
- ✅ Full control over when to refresh
- ✅ No external dependencies
- ✅ Can add to existing admin panel

### **Cons:**
- ❌ Manual - requires someone to click the button
- ❌ Not automatic - products won't update immediately
- ❌ Requires admin access/authentication

### **Cost:** Free

---

## Option 3: Scheduled Revalidation (Cron Job) ⏰

### **Best For:** Predictable update schedules, batch updates

### **How It Works:**
1. Set up a cron job or scheduled task
2. Job calls your revalidation API at regular intervals (e.g., every 15 minutes)
3. Cache is cleared automatically on schedule

### **Implementation Steps:**

#### Option A: Using Vercel Cron Jobs (if deployed on Vercel)

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/revalidate-products",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

Create `app/api/cron/revalidate-products/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    revalidateTag('products');
    revalidateTag('shopify');
    
    console.log('✅ Products revalidated via cron job');
    
    return NextResponse.json({ 
      revalidated: true, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
```

Add to `.env.local`:
```env
CRON_SECRET=your_random_secret_here
```

#### Option B: Using External Cron Service (e.g., cron-job.org, EasyCron)

1. Create the same API route as above
2. Sign up for a free cron service
3. Configure it to call your API endpoint: `https://yourdomain.com/api/cron/revalidate-products`
4. Set schedule (e.g., every 15 minutes: `*/15 * * * *`)
5. Add authorization header: `Bearer your_secret`

#### Option C: Using GitHub Actions (if on GitHub)

Create `.github/workflows/revalidate-products.yml`:
```yaml
name: Revalidate Products Cache

on:
  schedule:
    # Runs every 15 minutes
    - cron: '*/15 * * * *'
  workflow_dispatch: # Allows manual triggering

jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Revalidation
        run: |
          curl -X POST https://yourdomain.com/api/admin/revalidate/products \
            -H "Content-Type: application/json"
```

### **Pros:**
- ✅ Automatic - no manual intervention
- ✅ Predictable - runs on schedule
- ✅ Can run frequently (every 15 min = max 4x cache duration)
- ✅ Works with any hosting provider

### **Cons:**
- ❌ Not truly real-time (depends on schedule frequency)
- ❌ May refresh unnecessarily (even when no changes)
- ❌ Requires cron job setup/service

### **Cost:** 
- Vercel Cron: Free on Pro plan, limited on Hobby
- External services: Free for basic usage, paid for advanced features
- GitHub Actions: Free for public repos

---

## Option 4: URL-Based Revalidation (Quick & Dirty) 🔗

### **Best For:** Quick testing, emergency cache clears, development

### **How It Works:**
1. Add a secret URL parameter to your API route
2. Visit the URL to clear the cache
3. No UI needed - just bookmark the URL

### **Implementation:**

Update `app/api/admin/revalidate/products/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  
  // Check secret token
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    revalidateTag('products');
    revalidateTag('shopify');
    
    return NextResponse.json({ 
      revalidated: true, 
      message: 'Product cache cleared!',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
```

Add to `.env.local`:
```env
REVALIDATE_SECRET=your_random_secret_token_here
```

**Usage:**
Simply visit: `https://yourdomain.com/api/admin/revalidate/products?secret=your_random_secret_token_here`

Bookmark this URL for quick access!

### **Pros:**
- ✅ Extremely simple - no UI needed
- ✅ Fast - just visit a URL
- ✅ Shareable - can give URL to team members
- ✅ Works anywhere - desktop, mobile, etc.

### **Cons:**
- ❌ Security risk if URL is leaked
- ❌ Not user-friendly - no confirmation UI
- ❌ Manual - requires someone to trigger it

### **Cost:** Free

---

## Comparison Matrix 📊

| Option | Automatic | Real-Time | Complexity | Best For | Cost |
|--------|-----------|-----------|------------|----------|------|
| **Webhooks** | ✅ Yes | ✅ Yes | Medium | Production | Free |
| **Admin Button** | ❌ No | ⚠️ Manual | Low | Small Teams | Free |
| **Cron Job** | ✅ Yes | ⚠️ Scheduled | Medium | Predictable Updates | Free-Paid |
| **URL Token** | ❌ No | ⚠️ Manual | Very Low | Testing/Dev | Free |

---

## Recommendation by Use Case 🎯

### **Production E-commerce Site (High Traffic)**
→ **Option 1: Shopify Webhooks**
- Reason: Real-time updates, fully automatic, production-ready

### **Small Business / Portfolio Site**
→ **Option 2: Admin Button**
- Reason: Simple, manual control is acceptable for low update frequency

### **Content Site with Regular Updates**
→ **Option 3: Cron Job (every 15-30 min)**
- Reason: Automatic without webhook complexity

### **Development / Testing**
→ **Option 4: URL Token**
- Reason: Quick and easy for testing cache behavior

---

## Hybrid Approach 🔄

You can implement **multiple options** simultaneously:

```typescript
// All three routes can coexist:
// 1. Webhook: /api/revalidate/products (POST)
// 2. Admin: /api/admin/revalidate/products (POST)  
// 3. URL: /api/admin/revalidate/products?secret=xxx (GET)
```

**Benefits:**
- Automatic via webhooks (primary)
- Manual override via admin button (backup)
- Emergency URL access (fallback)

---

## Next Steps 🚀

1. **Choose your preferred revalidation method(s)**
2. **Implement the option(s) that fit your needs**
3. **Test the revalidation process**
4. **Monitor cache performance**

---

## Testing Your Cache 🧪

### Verify Cache is Working:

```bash
# Make first request (should hit Shopify)
curl https://yourdomain.com/api/products

# Make second request within 1 hour (should be cached)
curl https://yourdomain.com/api/products

# Check response times - cached should be much faster!
```

### Test Revalidation:

1. Note the current products on your site
2. Add/update a product in Shopify
3. Trigger revalidation (webhook, button, or URL)
4. Refresh your site - new product should appear!

---

## Monitoring & Debugging 🔍

### Check Cache Headers:

```bash
curl -I https://yourdomain.com/api/products
# Look for: x-vercel-cache: HIT (cached) or MISS (fresh)
```

### Add Logging:

```typescript
// In your shopifyFetch function
console.log('Fetching from Shopify at:', new Date().toISOString());
```

---

## Questions or Issues? 🤔

If you encounter issues:
1. Check that cache tags are set correctly in `src/lib/shopify.ts`
2. Verify environment variables are set
3. Test revalidation endpoints directly
4. Check server logs for errors

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-09  
**Current Cache Duration:** 1 hour (3600 seconds)





