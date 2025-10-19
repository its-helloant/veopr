# VeoPR Products System

## Overview

Your VeoPR website now has a **hybrid product system** that supports both Shopify e-commerce products and custom products from other sources.

## Quick Start

### Current Setup (Works Out of the Box)
- ✅ All Latin Doctors Pharma products from Shopify
- ✅ Full shopping cart and checkout
- ✅ Search and filtering

### Adding Custom Products (Optional)

**1-Minute Quick Start:**

```typescript
// Edit: src/data/custom-products.ts

export const customProducts = [
  {
    id: 'custom-001',
    handle: 'my-service',
    name: 'My Service',
    description: 'Service description',
    price: 99.00,
    currency: 'USD',
    images: [{ url: '/images/service.jpg', alt: 'Service' }],
    availableForSale: true,
    tags: ['service'],
    productType: 'Services',
    vendor: 'VeoPR',
    source: 'custom',
    purchaseOptions: {
      type: 'contact_form',
      contactEmail: 'info@veopr.com',
      buttonText: 'Contact Us'
    }
  }
];
```

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    /productos Page                           │
│  (Unified display - all products look the same to users)    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├── useProducts() hook
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
┌──────────────┐    ┌──────────────────┐
│   Shopify    │    │ Custom Products  │
│   Products   │    │  (local/CMS)     │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       │                     │
       ▼                     ▼
┌──────────────┐    ┌──────────────────┐
│ Add to Cart  │    │ External Link    │
│ → Checkout   │    │ Contact Form     │
└──────────────┘    │ Custom Action    │
                    └──────────────────┘
```

## Product Types

| Type | Button Action | Use Case | Example |
|------|---------------|----------|---------|
| **Shopify** | Add to Cart | E-commerce | Latin Doctors products |
| **External Link** | Opens URL | Affiliate/Partner | Amazon products |
| **Contact** | Opens Email | Services | Consultations |
| **Custom** | Your logic | Future | Special handling |

## Files Overview

```
veopr/
├── src/
│   ├── types/
│   │   ├── product.ts          ★ Unified types (NEW)
│   │   └── shopify.ts          (Existing)
│   ├── lib/
│   │   ├── products.ts         ★ Combines sources (NEW)
│   │   └── shopify.ts          (Existing)
│   ├── data/
│   │   └── custom-products.ts  ★ Add products here (NEW)
│   ├── hooks/
│   │   ├── useProducts.ts      ★ Unified hook (NEW)
│   │   └── useShopifyCart.ts   (Existing)
│   └── ...
├── app/
│   ├── api/
│   │   ├── products/           ★ Unified API (NEW)
│   │   └── shopify/            (Existing)
│   └── (routes)/
│       └── productos/
│           └── Productos.tsx   (Updated for hybrid)
└── docs/
    ├── HYBRID_SYSTEM_SUMMARY.md       ★ Complete overview
    ├── HYBRID_PRODUCTS_GUIDE.md       ★ Technical guide
    ├── ADDING_CUSTOM_PRODUCTS.md      ★ Quick start
    ├── SHOPIFY_SETUP.md               (Existing)
    └── README_PRODUCTS.md             (This file)
```

★ = New files for hybrid system

## Documentation Guide

### I want to...

**...understand the system**
→ Read: `HYBRID_SYSTEM_SUMMARY.md`

**...add a custom product quickly**
→ Read: `ADDING_CUSTOM_PRODUCTS.md` (5 min read)

**...understand the technical implementation**
→ Read: `HYBRID_PRODUCTS_GUIDE.md` (15 min read)

**...set up Shopify integration**
→ Read: `SHOPIFY_SETUP.md`

**...see code examples**
→ Check: `src/data/custom-products.ts` (commented examples)

## Quick Examples

### Example 1: Service Product

```typescript
{
  id: 'service-001',
  handle: 'health-consultation',
  name: 'Virtual Health Consultation',
  price: 75.00,
  // ... basic fields ...
  source: 'custom',
  purchaseOptions: {
    type: 'contact_form',
    contactEmail: 'appointments@veopr.com',
    buttonText: 'Schedule Appointment'
  }
}
```

### Example 2: Affiliate Product

```typescript
{
  id: 'affiliate-001',
  handle: 'amazon-supplement',
  name: 'Premium Supplement (Amazon)',
  price: 29.99,
  // ... basic fields ...
  source: 'affiliate',
  purchaseOptions: {
    type: 'external_link',
    url: 'https://amazon.com/dp/EXAMPLE',
    buttonText: 'Buy on Amazon'
  }
}
```

## Migration Path

### Phase 1: Current (No Changes Needed)
```
Shopify Products Only
└── Works exactly as before
```

### Phase 2: Add Custom Products (When Ready)
```
Shopify + Custom Products
├── Edit custom-products.ts
└── Deploy changes
```

### Phase 3: CMS Integration (Future)
```
Shopify + CMS Products
├── Connect to Sanity/Contentful
├── Visual product management
└── No-code updates
```

## Features

### ✅ What Works Now
- Shopify products load automatically
- Full e-commerce (cart, checkout)
- Search and filtering
- Mobile responsive
- Custom products ready to add

### 🚀 Ready for Future
- CMS integration
- Database connection
- Admin dashboard
- Custom payment processing
- Analytics integration

## Common Questions

### Q: Do I need to add custom products now?
**A:** No! The system works perfectly with just Shopify products. Add custom products when you need them.

### Q: Will adding custom products break anything?
**A:** No. The system gracefully handles 0 or 1000+ custom products.

### Q: Can I remove the hybrid system?
**A:** Yes. Just use `useShopifyProducts` instead of `useProducts`. No other changes needed.

### Q: How do custom products work without Shopify?
**A:** They're stored locally (or in a CMS) and can link to external sites, trigger emails, or custom actions.

### Q: Can I have products from multiple Shopify stores?
**A:** Yes! Add products with `external_link` type pointing to other stores.

## Getting Started

**For Developers:**
```bash
# 1. Read the docs
cat HYBRID_SYSTEM_SUMMARY.md

# 2. Check type definitions
open src/types/product.ts

# 3. Add a test product
vim src/data/custom-products.ts

# 4. Restart and test
npm run dev
```

**For Content Managers:**
```bash
# 1. Read quick guide
cat ADDING_CUSTOM_PRODUCTS.md

# 2. Copy an example
# Edit: src/data/custom-products.ts

# 3. Add your product info
# 4. Save and deploy
```

## Support

- 📖 Documentation in `/docs`
- 💻 Examples in `src/data/custom-products.ts`
- 🔧 Type definitions in `src/types/product.ts`

## Summary

**You have:**
- ✅ Shopify integration (working now)
- ✅ Hybrid product system (ready to use)
- ✅ Flexible purchase options
- ✅ Future-proof architecture
- ✅ Complete documentation

**No action required** - system works perfectly as-is!

**When ready to add custom products:**
1. Read `ADDING_CUSTOM_PRODUCTS.md`
2. Edit `src/data/custom-products.ts`
3. Done! 🎉

---

**Questions?** Check the documentation files listed above.

