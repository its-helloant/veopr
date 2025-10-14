'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Product, isShopifyProduct } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { 
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface ProductDetailProps {
  params?: Promise<{
    handle?: string;
  }>;
}

const ProductDetail = ({ params }: ProductDetailProps) => {
  const router = useRouter();
  const [handle, setHandle] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { addItem, loading: cartLoading } = useCart();

  // Handle async params
  useEffect(() => {
    if (params) {
      params.then(resolvedParams => {
        setHandle(resolvedParams.handle || '');
      });
    }
  }, [params]);

  // Fetch product data
  useEffect(() => {
    if (!handle) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products/${handle}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Producto no encontrado');
          } else {
            setError('Error al cargar el producto');
          }
          return;
        }

        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // Touch handlers for image swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !product) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && product.images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && product.images.length > 1) {
      prevImage();
    }
  };

  const addToCart = async () => {
    if (!product || !isShopifyProduct(product)) return;
    
    try {
      const variant = product.variants[selectedVariantIndex];
      if (!variant) return;
      
      await addItem(variant.id, quantity);
      // Optional: Show success notification
      console.log('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Optional: Show error notification
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto padding-mobile py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error or not found state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto padding-mobile py-8">
          <div className="text-center py-12">
            <h2 className="text-mobile-h2 text-gray-900 margin-mobile">
              {error || 'Producto no encontrado'}
            </h2>
            <p className="text-mobile-body text-gray-600 margin-mobile">
              El producto que buscas no existe o ha sido removido.
            </p>
            <Link 
              href="/productos" 
              className="touch-target bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
            >
              Volver a productos
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get selected variant for Shopify products
  const selectedVariant = isShopifyProduct(product) ? product.variants[selectedVariantIndex] : null;
  const currentPrice = selectedVariant?.price || product.price;
  const compareAtPrice = selectedVariant?.compareAtPrice || product.compareAtPrice;
  const isAvailable = selectedVariant?.availableForSale ?? product.availableForSale;
  const canAddToCart = isShopifyProduct(product) && isAvailable;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto padding-mobile py-4 sm:py-8">
        {/* Breadcrumb - Hidden on mobile to save space */}
        <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-600 margin-mobile">
          <Link href="/" className="hover:text-blue-500">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-blue-500">Productos</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button - Mobile optimized */}
        <button
          onClick={() => router.back()}
          className="touch-target flex items-center gap-2 text-gray-600 hover:text-gray-900 margin-mobile transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-mobile-body">Volver</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-16">
          {/* Product Images - Enhanced for mobile */}
          <div className="space-y-4">
            {/* Main Image with touch support */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border">
              <div 
                className="aspect-square bg-gray-200 flex items-center justify-center cursor-grab active:cursor-grabbing"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {product.images[currentImageIndex] ? (
                  <img 
                    src={product.images[currentImageIndex].url} 
                    alt={product.images[currentImageIndex].alt || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-16 sm:w-24 h-16 sm:h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                  </svg>
                )}
              </div>
              
              {/* Enhanced Image Navigation for mobile */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white touch-target rounded-full shadow-lg transition-colors"
                  >
                    <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white touch-target rounded-full shadow-lg transition-colors"
                  >
                    <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                  
                  {/* Image indicators for mobile */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Images - Improved for mobile */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 touch-target w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg border-2 transition-colors overflow-hidden ${
                      currentImageIndex === index ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    {image.url ? (
                      <img 
                        src={image.url} 
                        alt={image.alt || `${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Mobile optimized layout */}
          <div className="space-y-4 sm:space-y-6">
            {/* Header - Mobile optimized typography */}
            <div>
              <div className="flex items-center gap-2 margin-mobile">
                {product.productType && (
                  <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {product.productType}
                  </span>
                )}
                {product.vendor && (
                  <span className="text-xs sm:text-sm text-gray-500">{product.vendor}</span>
                )}
              </div>
              <h1 className="text-mobile-h1 text-gray-900 margin-mobile">{product.name}</h1>
              <p className="text-mobile-body text-gray-600">{product.description}</p>
            </div>

            {/* Price - Prominent on mobile */}
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                ${currentPrice.toFixed(2)}
              </div>
              {compareAtPrice && compareAtPrice > currentPrice && (
                <div className="text-lg text-gray-500 line-through">
                  ${compareAtPrice.toFixed(2)}
                </div>
              )}
            </div>

            {/* Variants for Shopify products */}
            {isShopifyProduct(product) && product.variants.length > 1 && (
              <div>
                <h3 className="text-mobile-body font-medium text-gray-900 mb-2">Opciones</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantIndex(index)}
                      disabled={!variant.availableForSale}
                      className={`touch-target px-3 sm:px-4 py-2 border rounded-lg text-mobile-body font-medium transition-colors ${
                        selectedVariantIndex === index
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : variant.availableForSale
                          ? 'border-gray-300 text-gray-700 hover:border-gray-400'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {variant.title}
                      {!variant.availableForSale && ' (Agotado)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity - Mobile optimized */}
            {canAddToCart && (
              <div>
                <h3 className="text-mobile-body font-medium text-gray-900 mb-2">Cantidad</h3>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="touch-target hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center text-mobile-body">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="touch-target hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons - Mobile optimized */}
            <div className="flex gap-3 sm:gap-4">
              {canAddToCart ? (
                <button 
                  onClick={addToCart}
                  disabled={cartLoading}
                  className="flex-1 bg-blue-500 text-white touch-target rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-mobile-body font-medium"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">{cartLoading ? 'Agregando...' : 'Agregar al carrito'}</span>
                  <span className="sm:hidden">{cartLoading ? 'Agregando...' : 'Agregar'}</span>
                </button>
              ) : (
                <button 
                  disabled
                  className="flex-1 bg-gray-400 text-white touch-target rounded-lg cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-mobile-body font-medium"
                >
                  {isAvailable ? 'No disponible' : 'Agotado'}
                </button>
              )}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="touch-target border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isFavorite ? (
                  <HeartSolidIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                )}
              </button>
              <button className="touch-target border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <ShareIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-mobile-body text-gray-600">
                {isAvailable ? 'En stock' : 'Agotado'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details - Mobile optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-16">
          {/* Description */}
          <div>
            <h2 className="text-mobile-h2 text-gray-900 margin-mobile">Descripción</h2>
            <p className="text-mobile-body text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Additional Info */}
          <div>
            <h2 className="text-mobile-h2 text-gray-900 margin-mobile">Información adicional</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-mobile-body text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                Vendido por: {product.vendor}
              </li>
              {product.productType && (
                <li className="flex items-center gap-2 text-mobile-body text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  Tipo: {product.productType}
                </li>
              )}
              <li className="flex items-center gap-2 text-mobile-body text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                Moneda: {product.currency}
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Sticky Add to Cart Button for Mobile */}
      {canAddToCart && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900">${currentPrice.toFixed(2)}</div>
              <div className="text-sm text-gray-600">
                {selectedVariant && `${selectedVariant.title} • `}
                Cantidad: {quantity}
              </div>
            </div>
            <button 
              onClick={addToCart}
              disabled={cartLoading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cartLoading ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
        </div>
      )}

      {/* Add bottom padding to account for sticky button on mobile */}
      {canAddToCart && <div className="h-24 md:hidden"></div>}

      <Footer />
    </div>
  );
};

export default ProductDetail; 