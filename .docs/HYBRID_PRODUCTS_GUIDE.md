# Hybrid Products System - User Guide

## Overview

Your VeoPR website now supports **both Shopify and custom products** in a unified system. This allows you to display products from multiple sources while maintaining a consistent user experience.

## Product Sources

### 1. **Shopify Products**
- Automatically fetched from Latin Doctors Pharma store
- Full e-commerce functionality (add to cart, checkout)
- Inventory managed in Shopify
- Updates automatically when Shopify products change

### 2. **Custom Products**
- Locally managed (can be extended to CMS/database)
- Flexible purchase options:
  - **External Links** - Link to other websites
  - **Contact Forms** - Email inquiries
  - **Custom Actions** - Define your own behavior

## How It Works

### Unified Product Display

All products (Shopify + Custom) appear together on `/productos` page:
- Same search functionality
- Same filtering options
- Same responsive design
- Different button actions based on product type

### Purchase Actions

The system automatically determines the correct action for each product:

| Product Type | Button Text | Action |
|-------------|-------------|--------|
| Shopify | "Agregar al carrito" | Adds to cart → Shopify checkout |
| External Link | "Ver Producto" | Opens external URL |
| Contact | "Contactar" | Opens email client |
| Custom | Configurable | Your custom logic |

## Adding Custom Products

### Method 1: Edit Data File (Simple)

Edit `src/data/custom-products.ts` and add products to the array:

```typescript
export const customProducts: CustomProductData[] = [
  {
    id: 'custom-001',
    handle: 'consulting-service',
    name: 'Servicio de Consultoría Médica',
    description: 'Asesoría personalizada con nuestros expertos',
    price: 150.00,
    currency: 'USD',
    images: [
      {
        url: '/images/consulting.jpg',
        alt: 'Consulting Service',
        width: 800,
        height: 800,
      }
    ],
    availableForSale: true,
    tags: ['service', 'consulting', 'medical'],
    productType: 'Services',
    vendor: 'VeoPR',
    source: 'custom',
    purchaseOptions: {
      type: 'contact_form',
      contactEmail: 'info@veopr.com',
      buttonText: 'Solicitar Información'
    }
  },
  // Add more products here...
];
```

### Method 2: API Route (Advanced)

Create products programmatically via API:

```typescript
// Example: POST to create custom product
const response = await fetch('/api/custom-products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Custom Product',
    // ... other fields
  })
});
```

## Product Types

### External Link Products

Perfect for affiliate products or items sold elsewhere:

```typescript
{
  id: 'affiliate-001',
  handle: 'external-supplement',
  name: 'Premium Supplement (Amazon)',
  description: 'Available on Amazon with Prime shipping',
  price: 29.99,
  currency: 'USD',
  images: [{ url: '/images/supplement.jpg', alt: 'Supplement' }],
  availableForSale: true,
  tags: ['affiliate', 'amazon'],
  productType: 'Supplements',
  vendor: 'Amazon',
  source: 'affiliate',
  purchaseOptions: {
    type: 'external_link',
    url: 'https://amazon.com/your-product',
    buttonText: 'Comprar en Amazon'
  }
}
```

### Contact-Based Products

For services or products requiring consultation:

```typescript
{
  id: 'service-001',
  handle: 'health-consultation',
  name: 'Consulta de Salud Virtual',
  description: 'Sesión de 30 minutos con especialista',
  price: 75.00,
  currency: 'USD',
  images: [{ url: '/images/consultation.jpg', alt: 'Consultation' }],
  availableForSale: true,
  tags: ['service', 'telemedicine'],
  productType: 'Services',
  vendor: 'VeoPR',
  source: 'custom',
  purchaseOptions: {
    type: 'contact_form',
    contactEmail: 'appointments@veopr.com',
    buttonText: 'Agendar Consulta'
  }
}
```

### Custom Action Products

For special handling:

```typescript
{
  id: 'custom-001',
  handle: 'custom-product',
  name: 'Special Product',
  // ... other fields
  source: 'other',
  purchaseOptions: {
    type: 'custom',
    customData: {
      // Your custom data
      action: 'special_handling',
      parameters: { /* ... */ }
    },
    buttonText: 'Special Action'
  }
}
```

## Architecture

### File Structure

```
src/
├── types/
│   ├── product.ts          # Unified product types
│   └── shopify.ts          # Shopify-specific types
├── lib/
│   ├── products.ts         # Unified product API (combines sources)
│   └── shopify.ts          # Shopify API client
├── data/
│   └── custom-products.ts  # Custom products data
├── hooks/
│   ├── useProducts.ts      # Unified products hook
│   └── useShopifyCart.ts   # Cart management
└── components/
    └── ...
```

### Data Flow

```
┌─────────────────┐
│  Shopify Store  │
└────────┬────────┘
         │
         ├──→ Shopify API → shopify.ts → products.ts
         │                                     ↓
┌────────┴────────┐                    useProducts()
│ Custom Products │                          ↓
└─────────────────┘              React Component (Productos.tsx)
```

## Future Enhancements

### Option 1: CMS Integration (Recommended)

Replace `custom-products.ts` with a headless CMS:

**Recommended CMS Options:**
- **Sanity.io** - Excellent for products, free tier
- **Strapi** - Open source, self-hosted
- **Contentful** - Enterprise-grade
- **Prismic** - Developer-friendly

**Benefits:**
- Visual product management
- No code deployment for product updates
- Image optimization
- Version control
- Multi-language support

### Option 2: Database Integration

Store custom products in a database:

**Options:**
- **Supabase** - PostgreSQL with real-time
- **Planetscale** - Serverless MySQL
- **MongoDB Atlas** - NoSQL
- **Firebase** - Google's platform

**Benefits:**
- Scalability
- Real-time updates
- User-specific products
- Analytics integration

### Option 3: Admin Dashboard

Build a custom admin interface:

```
/admin
├── /products
│   ├── /create   - Add new products
│   ├── /edit/:id - Edit products
│   └── /list     - View all products
└── /settings
```

## Migration Path

### Phase 1: Current (Manual)
✅ Edit `custom-products.ts` file
✅ Commit and deploy changes
✅ Products appear immediately

### Phase 2: CMS (Recommended Next Step)
1. Choose a CMS (recommend Sanity)
2. Set up product schema
3. Create API route to fetch from CMS
4. Update `getCustomProducts()` to use CMS API
5. Deploy

### Phase 3: Admin Dashboard (Optional)
1. Build admin UI with Next.js
2. Add authentication (NextAuth.js)
3. Create product management forms
4. Connect to database/CMS
5. Deploy

## Examples

### Example 1: VeoPR Merchandise

```typescript
{
  id: 'merch-001',
  handle: 'veopr-tshirt',
  name: 'Camiseta Oficial VeoPR',
  description: 'Camiseta 100% algodón con logo VeoPR',
  price: 25.00,
  currency: 'USD',
  images: [{ url: '/images/tshirt.jpg', alt: 'VeoPR T-Shirt' }],
  availableForSale: true,
  tags: ['merchandise', 'clothing'],
  productType: 'Apparel',
  vendor: 'VeoPR',
  source: 'custom',
  purchaseOptions: {
    type: 'contact_form',
    contactEmail: 'merch@veopr.com',
    buttonText: 'Ordenar Ahora'
  }
}
```

### Example 2: Partner Product

```typescript
{
  id: 'partner-001',
  handle: 'partner-device',
  name: 'Monitor de Presión Premium',
  description: 'Producto de nuestro socio comercial',
  price: 89.99,
  currency: 'USD',
  images: [{ url: '/images/monitor.jpg', alt: 'Blood Pressure Monitor' }],
  availableForSale: true,
  tags: ['medical-device', 'partner'],
  productType: 'Medical Devices',
  vendor: 'Partner Medical',
  source: 'affiliate',
  purchaseOptions: {
    type: 'external_link',
    url: 'https://partner-site.com/product',
    buttonText: 'Ver en Tienda del Socio'
  }
}
```

### Example 3: Program Membership

```typescript
{
  id: 'program-001',
  handle: 'premium-membership',
  name: 'Membresía Premium VeoPR',
  description: 'Acceso exclusivo a contenido premium',
  price: 9.99,
  currency: 'USD',
  images: [{ url: '/images/premium.jpg', alt: 'Premium Membership' }],
  availableForSale: true,
  tags: ['membership', 'subscription'],
  productType: 'Memberships',
  vendor: 'VeoPR',
  source: 'custom',
  purchaseOptions: {
    type: 'external_link',
    url: 'https://members.veopr.com/subscribe',
    buttonText: 'Suscribirse Ahora'
  }
}
```

## Testing

### Test Checklist

- [ ] Shopify products load correctly
- [ ] Custom products appear in the list
- [ ] Search works across all products
- [ ] Filters work for all product types
- [ ] Shopify "Add to Cart" buttons work
- [ ] External link buttons open new tabs
- [ ] Contact buttons open email client
- [ ] Mobile responsive for all product types

## Troubleshooting

### Products not appearing?

1. Check `custom-products.ts` syntax
2. Verify product has `source` field
3. Check browser console for errors
4. Restart dev server

### Button not working?

1. Verify `purchaseOptions.type` is correct
2. Check URL format for external links
3. Verify email format for contact
4. Check browser console

### Mix of Shopify and Custom?

Perfect! That's the goal. The system handles both seamlessly.

## Best Practices

1. **Consistent Naming**: Use clear, descriptive product names
2. **Quality Images**: Use high-res images (min 800x800px)
3. **Accurate Pricing**: Keep prices updated
4. **Clear Descriptions**: Help users understand the product
5. **Proper Tags**: Use tags for better filtering
6. **Test Thoroughly**: Test all button actions

## Support

Need help? Check:
1. This guide
2. `src/types/product.ts` - Type definitions
3. `src/lib/products.ts` - Product logic
4. `src/data/custom-products.ts` - Examples

---

**You now have a flexible system that supports both Shopify products and custom products!** 🎉

