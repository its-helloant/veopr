# Quick Start: Adding Custom Products

## 🚀 Quick Example

Want to add a non-Shopify product? Here's how:

### Step 1: Open the file

Edit: `src/data/custom-products.ts`

### Step 2: Add your product

```typescript
export const customProducts: CustomProductData[] = [
  {
    id: 'custom-001',
    handle: 'consulting-service',
    name: 'Servicio de Consultoría',
    description: 'Asesoría personalizada con nuestros expertos',
    price: 150.00,
    currency: 'USD',
    images: [
      {
        url: '/images/consulting.jpg',
        alt: 'Consulting Service',
      }
    ],
    availableForSale: true,
    tags: ['service', 'consulting'],
    productType: 'Services',
    vendor: 'VeoPR',
    source: 'custom',
    purchaseOptions: {
      type: 'contact_form',
      contactEmail: 'info@veopr.com',
      buttonText: 'Contactar'
    }
  },
  // Add more products here...
];
```

### Step 3: Save and restart

```bash
# Server will hot-reload, or restart manually:
npm run dev
```

### Step 4: Done! ✅

Your product now appears on `/productos` alongside Shopify products.

## Product Types

### Type 1: External Link (Affiliate/Partner Products)

```typescript
{
  id: 'affiliate-001',
  handle: 'amazon-product',
  name: 'Product on Amazon',
  // ... basic fields ...
  source: 'affiliate',
  purchaseOptions: {
    type: 'external_link',
    url: 'https://amazon.com/your-product',
    buttonText: 'Comprar en Amazon'
  }
}
```

**Result**: Button says "Comprar en Amazon" and opens Amazon in new tab.

---

### Type 2: Contact/Inquiry (Services, Custom Orders)

```typescript
{
  id: 'service-001',
  handle: 'health-consultation',
  name: 'Consulta de Salud',
  // ... basic fields ...
  source: 'custom',
  purchaseOptions: {
    type: 'contact_form',
    contactEmail: 'appointments@veopr.com',
    buttonText: 'Agendar Consulta'
  }
}
```

**Result**: Button says "Agendar Consulta" and opens email client.

---

### Type 3: Shopify Redirect (Different Shopify Store)

```typescript
{
  id: 'other-store-001',
  handle: 'product-from-other-store',
  name: 'Product from Another Store',
  // ... basic fields ...
  source: 'other',
  purchaseOptions: {
    type: 'shopify_redirect',
    url: 'https://other-store.myshopify.com/products/product-handle',
    buttonText: 'Ver en Tienda'
  }
}
```

**Result**: Opens different Shopify store in new tab.

## Field Reference

### Required Fields

```typescript
{
  id: string;              // Unique ID (e.g., 'custom-001')
  handle: string;          // URL-friendly name (e.g., 'my-product')
  name: string;            // Display name
  description: string;     // Product description
  price: number;           // Price (e.g., 29.99)
  currency: string;        // 'USD', 'EUR', etc.
  images: Array;           // At least one image
  availableForSale: boolean; // true/false
  tags: string[];          // ['tag1', 'tag2']
  productType: string;     // Category (e.g., 'Services')
  vendor: string;          // Vendor name
  source: string;          // 'custom', 'affiliate', or 'other'
  purchaseOptions: {       // See types above
    type: string;
    // ... type-specific fields
  }
}
```

### Optional Fields

```typescript
{
  compareAtPrice: number;        // Original price (for sales)
  sku: string;                   // Stock keeping unit
  stock: number;                 // Available quantity
  metadata: Record<string, any>; // Custom data
}
```

## Real-World Examples

### Example: VeoPR Merchandise

```typescript
{
  id: 'merch-tshirt-001',
  handle: 'veopr-official-tshirt',
  name: 'Camiseta Oficial VeoPR',
  description: 'Camiseta 100% algodón con logo VeoPR. Disponible en varios colores.',
  price: 25.00,
  currency: 'USD',
  images: [
    {
      url: '/images/products/veopr-tshirt.jpg',
      alt: 'Camiseta VeoPR',
      width: 800,
      height: 800,
    }
  ],
  availableForSale: true,
  tags: ['merchandise', 'clothing', 'veopr'],
  productType: 'Apparel',
  vendor: 'VeoPR',
  source: 'custom',
  purchaseOptions: {
    type: 'contact_form',
    contactEmail: 'merch@veopr.com',
    buttonText: 'Ordenar Ahora'
  },
  sku: 'VEOPR-TSHIRT-001',
  stock: 50,
}
```

### Example: Telemedicine Service

```typescript
{
  id: 'service-telemedicine-001',
  handle: 'virtual-health-consultation',
  name: 'Consulta Virtual de Salud',
  description: 'Sesión de 30 minutos con un médico certificado vía videollamada.',
  price: 75.00,
  currency: 'USD',
  images: [
    {
      url: '/images/products/telemedicine.jpg',
      alt: 'Consulta Virtual',
    }
  ],
  availableForSale: true,
  tags: ['telemedicine', 'consultation', 'health'],
  productType: 'Medical Services',
  vendor: 'VeoPR Health',
  source: 'custom',
  purchaseOptions: {
    type: 'contact_form',
    contactEmail: 'appointments@veopr.com',
    buttonText: 'Agendar Cita'
  },
  metadata: {
    duration: '30 minutes',
    platform: 'Zoom',
    languages: ['Spanish', 'English']
  }
}
```

### Example: Partner Product on Amazon

```typescript
{
  id: 'affiliate-blood-pressure-monitor',
  handle: 'omron-blood-pressure-monitor',
  name: 'Monitor de Presión Arterial OMRON',
  description: 'Monitor digital automático de presión arterial. Recomendado por nuestros médicos.',
  price: 89.99,
  compareAtPrice: 119.99, // Show discount
  currency: 'USD',
  images: [
    {
      url: '/images/products/omron-monitor.jpg',
      alt: 'OMRON Blood Pressure Monitor',
    }
  ],
  availableForSale: true,
  tags: ['medical-device', 'monitoring', 'recommended'],
  productType: 'Medical Devices',
  vendor: 'OMRON',
  source: 'affiliate',
  purchaseOptions: {
    type: 'external_link',
    url: 'https://amazon.com/dp/B00EXAMPLE',
    buttonText: 'Comprar en Amazon'
  }
}
```

## Tips

### 1. Images
- Place images in `/public/images/products/`
- Use descriptive filenames
- Recommended size: 800x800px minimum
- Supported formats: JPG, PNG, WebP

### 2. Handles
- Must be unique
- Use lowercase with hyphens
- Keep it simple and descriptive
- Examples: `consulting-service`, `veopr-tshirt`, `blood-pressure-monitor`

### 3. Tags
- Use for filtering and search
- Keep consistent across similar products
- Examples: `['service', 'medical']`, `['merchandise', 'clothing']`

### 4. Product Types
- Acts as category
- Keep consistent for filtering
- Examples: `'Services'`, `'Apparel'`, `'Medical Devices'`, `'Supplements'`

## What's Next?

After adding products, you might want to:

1. **Add product detail pages** - Show full info for custom products
2. **Integrate with CMS** - Manage products visually (Sanity, Contentful)
3. **Add custom checkout** - Handle payments for custom products
4. **Track analytics** - Monitor which products get clicked
5. **Add reviews** - Let users review custom products

## Need Help?

- See full guide: `HYBRID_PRODUCTS_GUIDE.md`
- Check type definitions: `src/types/product.ts`
- View examples: `src/data/custom-products.ts`

---

**That's it! You can now mix Shopify products with custom products seamlessly.** 🎉

