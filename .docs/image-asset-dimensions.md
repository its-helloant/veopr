# Image Asset Dimensions Guide for VeoPR

## 📱 Responsive Breakpoints Reference
- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (sm to lg)
- **Desktop**: `≥ 1024px` (lg+)

---

## 🏠 Landing Page (`Landing.tsx`)

### Header/Navigation
- **Logo (VeoPR)**: `200x80px` @ 2x = `400x160px`
  - Used in header at `h-8` (32px height)
  - Maintains aspect ratio, auto-width

### Hero Section
- **Featured Program Banner**: `600x600px` @ 2x = `1200x1200px`
  - Used in Hero component for program showcase
  - Square aspect ratio for responsive card layout
  - Currently shows `dia-a-dia-logo.png`

### Programs Carousel
- **Program Cards**: `600x480px` @ 2x = `1200x960px`
  - Display at `h-40 sm:h-48` (160px mobile, 192px tablet+)
  - Aspect ratio: 5:4 (width:height)
  - Used for program thumbnails in `CarruselProgramas.tsx`

### Products Carousel
- **Product Cards**: `400x400px` @ 2x = `800x800px`
  - Display at `h-48` (192px height)
  - Square aspect ratio (1:1)
  - Used in `CarruselProductos.tsx`

---

## 🛍️ Products Page (`Productos.tsx`)

### Product Grid/List Cards
- **Grid View Images**: `400x400px` @ 2x = `800x800px`
  - Display at `h-40 sm:h-48` (160px mobile, 192px desktop)
  - Square aspect ratio for consistency
  - Optimized for hover/touch interactions

- **List View Thumbnails**: `200x200px` @ 2x = `400x400px`
  - Display at `w-16 h-16 sm:w-20 sm:h-20` (64px mobile, 80px tablet+)
  - Small square thumbnails for list layout

---

## 📦 Product Detail Page (`ProductDetail.tsx`)

### Main Product Images
- **Hero Images**: `800x800px` @ 2x = `1600x1600px`
  - Large square format for main product display
  - Support for image carousel/gallery
  - Used in main product showcase area

### Thumbnail Gallery
- **Thumbnail Images**: `200x200px` @ 2x = `400x400px`
  - Display at `w-16 h-16 sm:w-20 sm:h-20`
  - Small squares for image selection

### Related Products
- **Related Product Cards**: `400x400px` @ 2x = `800x800px`
  - Display at `h-40 sm:h-48`
  - Same as main product grid cards

---

## 🎯 Component-Specific Requirements

### Header Component
- **Main Logo**: `200x80px` @ 2x = `400x160px`
  - PNG format with transparent background
  - Optimized for dark background (header is `bg-gray-900`)

### Footer Component
- **Footer Logo**: `200x80px` @ 2x = `400x160px`
  - Same as header logo
  - Optimized for dark background

### Program Cards (CarruselProgramas)
- **Program Logos/Images**: `600x480px` @ 2x = `1200x960px`
  - Rectangular format (5:4 aspect ratio)
  - Should include program branding/logo overlay
  - Examples: Current `dia-a-dia-logo.png`, `rayos-x-logo.png`, etc.

---

## 📐 Technical Specifications

### File Formats
- **Logos**: PNG with transparency
- **Photos/Product Images**: JPG or WebP
- **Program Graphics**: PNG or JPG depending on content

### Optimization Requirements
- **All images should be provided at 2x resolution** for Retina displays
- **Compress images appropriately**:
  - JPG: 80-85% quality
  - PNG: Use tools like TinyPNG
  - Consider WebP format for better compression

### Responsive Behavior
- Images use CSS classes like `h-40 sm:h-48` which scales:
  - Mobile: 160px height
  - Tablet+: 192px height
- Width scales proportionally using `w-auto` or `object-cover`

---

## 🎨 Design Recommendations

### Product Images
- Use **consistent lighting and background** (preferably white/transparent)
- Show products at **slight angle** for depth
- Include **lifestyle shots** as secondary images
- Maintain **consistent padding/margins** around products

### Program Images
- Include **program logos prominently**
- Use **brand colors** consistently
- Consider **text overlays** for episode information
- Maintain **high contrast** for readability

### Logo Guidelines
- **VeoPR Logo**: Ensure readability at small sizes (32px height)
- **Program Logos**: Should work on both light and dark backgrounds
- Provide **horizontal and vertical** versions if needed

---

## 📱 Mobile-First Considerations

The project uses a mobile-first approach with classes like:
- `text-mobile-h1`, `text-mobile-h2`, `text-mobile-body`
- `padding-mobile`, `margin-mobile`
- `touch-target` (minimum 44px touch areas)

Ensure images work well at the smallest sizes first, then scale up for larger screens.

---

## 📋 Quick Reference Table

| Image Type | Dimensions (1x) | Dimensions (2x) | Display Size | Aspect Ratio | Format |
|------------|----------------|-----------------|--------------|--------------|--------|
| VeoPR Logo | 200x80px | 400x160px | 32px height | 5:2 | PNG |
| Hero Banner | 600x600px | 1200x1200px | Variable | 1:1 | PNG/JPG |
| Program Cards | 600x480px | 1200x960px | 160-192px height | 5:4 | PNG/JPG |
| Product Cards | 400x400px | 800x800px | 160-192px height | 1:1 | JPG |
| Product Hero | 800x800px | 1600x1600px | Variable | 1:1 | JPG |
| Product Thumbnails | 200x200px | 400x400px | 64-80px | 1:1 | JPG |
| List Thumbnails | 200x200px | 400x400px | 64-80px | 1:1 | JPG |

---

## 🔧 Implementation Notes

### Current Image Usage
Based on the codebase analysis, images are currently implemented using:
- Standard `<img>` tags with responsive classes
- Placeholder SVG icons where images are missing
- Object-cover for maintaining aspect ratios
- Touch-friendly interaction patterns

### Missing Images
The following images need to be created/optimized:
- Product images (currently using placeholder SVGs)
- Consistent program promotional images
- Hero banner variations for different programs

### Accessibility
- All images include proper `alt` attributes
- Images support keyboard navigation
- High contrast mode considerations are implemented 