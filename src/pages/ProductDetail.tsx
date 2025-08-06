'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { 
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  ShoppingCartIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// Product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    name: 'Camisa "Guardarme eso ahí"',
    description: 'Camiseta cómoda con el famoso catchphrase del programa',
    longDescription: 'Esta camiseta premium cuenta con el icónico catchphrase "Guardarme eso ahí" del programa Día a Día. Fabricada con algodón 100% de alta calidad, ofrece comodidad excepcional para el uso diario. El diseño incluye un estampado duradero que conserva su color después de múltiples lavados.',
    price: 25,
    show: 'Día a Día',
    category: 'Ropa',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400', '/api/placeholder/400/400'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Blanco', 'Azul marino', 'Gris'],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    features: [
      'Algodón 100% premium',
      'Diseño exclusivo del programa',
      'Estampado resistente al lavado',
      'Corte cómodo unisex'
    ]
  },
  {
    id: 2,
    name: 'Taza "Buenos días familia"',
    description: 'Taza de cerámica perfecta para el café matutino',
    longDescription: 'Comienza tu día con esta hermosa taza de cerámica que presenta el saludo característico del programa Día a Día. Perfecta para tu café, té o chocolate caliente matutino. Su diseño ergonómico y capacidad de 11 oz la hacen ideal para cualquier momento del día.',
    price: 15,
    show: 'Día a Día',
    category: 'Accesorios',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    sizes: ['11 oz'],
    colors: ['Blanco', 'Negro'],
    rating: 4.6,
    reviews: 89,
    inStock: true,
    features: [
      'Cerámica de alta calidad',
      'Apta para microondas',
      'Apta para lavavajillas',
      'Diseño exclusivo'
    ]
  },
  {
    id: 3,
    name: 'Gorra "Rayos X"',
    description: 'Gorra deportiva del programa de investigación',
    longDescription: 'Gorra deportiva oficial del programa Rayos X. Diseñada para los verdaderos fanáticos de la investigación periodística. Cuenta con ajuste posterior y visera curvada para máxima comodidad y protección solar.',
    price: 20,
    show: 'Rayos X',
    category: 'Ropa',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    sizes: ['Ajustable'],
    colors: ['Negro', 'Azul marino', 'Rojo'],
    rating: 4.7,
    reviews: 67,
    inStock: true,
    features: [
      'Ajuste posterior regulable',
      'Visera curvada',
      'Logo bordado',
      'Material transpirable'
    ]
  },
  {
    id: 4,
    name: 'Libreta "Apuntes médicos"',
    description: 'Libreta para tus notas importantes del programa',
    longDescription: 'Libreta de alta calidad perfecta para tomar apuntes durante el programa Médicos por la Salud. Con papel rayado de 120 hojas y tapa dura resistente, es ideal para estudiantes y profesionales de la salud.',
    price: 12,
    show: 'Médicos por la Salud',
    category: 'Papelería',
    images: ['/api/placeholder/400/400'],
    sizes: ['A5'],
    colors: ['Azul', 'Verde', 'Blanco'],
    rating: 4.5,
    reviews: 43,
    inStock: true,
    features: [
      'Tapa dura resistente',
      '120 hojas rayadas',
      'Papel de alta calidad',
      'Marcador de páginas incluido'
    ]
  },
  {
    id: 5,
    name: 'Camisa "Rayos X Investigación"',
    description: 'Camisa oficial del equipo de investigación',
    longDescription: 'Camisa polo oficial del equipo de investigación de Rayos X. Fabricada con mezcla de algodón y poliéster para mayor durabilidad y comodidad. Perfecta para eventos profesionales o uso casual.',
    price: 28,
    show: 'Rayos X',
    category: 'Ropa',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400', '/api/placeholder/400/400'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Azul', 'Blanco', 'Gris'],
    rating: 4.9,
    reviews: 156,
    inStock: true,
    features: [
      'Mezcla algodón-poliéster',
      'Diseño polo profesional',
      'Logo bordado del programa',
      'Fácil cuidado'
    ]
  },
  {
    id: 6,
    name: 'Termo "Día a Día"',
    description: 'Termo térmico para mantener tus bebidas a la temperatura perfecta',
    longDescription: 'Termo de acero inoxidable de doble pared que mantiene las bebidas calientes por hasta 12 horas y frías por hasta 24 horas. Diseño elegante con el logo del programa Día a Día.',
    price: 22,
    show: 'Día a Día',
    category: 'Accesorios',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    sizes: ['500ml', '750ml'],
    colors: ['Plateado', 'Negro', 'Azul'],
    rating: 4.8,
    reviews: 92,
    inStock: true,
    features: [
      'Acero inoxidable doble pared',
      'Mantiene temperatura 12h caliente / 24h frío',
      'Tapa a prueba de derrames',
      'Fácil de limpiar'
    ]
  },
  {
    id: 7,
    name: 'Stickers Pack "Médicos"',
    description: 'Pack de stickers del programa médico',
    longDescription: 'Pack de 15 stickers variados del programa Médicos por la Salud. Perfectos para personalizar tu laptop, cuadernos, botella de agua o cualquier superficie lisa. Material resistente al agua.',
    price: 8,
    show: 'Médicos por la Salud',
    category: 'Accesorios',
    images: ['/api/placeholder/400/400'],
    sizes: ['Pack de 15'],
    colors: ['Multicolor'],
    rating: 4.4,
    reviews: 76,
    inStock: true,
    features: [
      'Pack de 15 stickers variados',
      'Material resistente al agua',
      'Adhesivo de alta calidad',
      'Diseños exclusivos del programa'
    ]
  },
  {
    id: 8,
    name: 'Hoodie "VeoPR"',
    description: 'Sudadera con capucha del canal',
    longDescription: 'Sudadera premium con capucha del canal VeoPR. Fabricada con algodón orgánico y poliéster reciclado. Incluye bolsillo frontal tipo canguro y cordones ajustables. Perfecta para cualquier temporada.',
    price: 35,
    show: 'General',
    category: 'Ropa',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400', '/api/placeholder/400/400'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Gris', 'Azul marino', 'Vino'],
    rating: 4.9,
    reviews: 203,
    inStock: true,
    features: [
      'Algodón orgánico y poliéster reciclado',
      'Bolsillo frontal tipo canguro',
      'Capucha con cordones ajustables',
      'Logo bordado premium'
    ]
  }
];

interface ProductDetailProps {
  params?: Promise<{
    id?: string;
  }>;
}

const ProductDetail = ({ params }: ProductDetailProps) => {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Handle async params
  useEffect(() => {
    if (params) {
      params.then(resolvedParams => {
        setId(resolvedParams.id || '');
      });
    }
  }, [params]);

  const product = mockProducts.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto padding-mobile py-8">
          <div className="text-center py-12">
            <h2 className="text-mobile-h2 text-gray-900 margin-mobile">Producto no encontrado</h2>
            <p className="text-mobile-body text-gray-600 margin-mobile">El producto que buscas no existe o ha sido removido.</p>
            <Link 
              href="/productos" 
              className="touch-target bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Volver a productos
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = mockProducts.filter(p => 
    p.id !== product.id && (p.show === product.show || p.category === product.category)
  ).slice(0, 4);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
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
    if (!touchStart || !touchEnd) return;
    
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

  const addToCart = () => {
    // Add to cart logic would go here
    console.log('Added to cart:', { product, selectedSize, selectedColor, quantity });
  };

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
                <svg className="w-16 sm:w-24 h-16 sm:h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                </svg>
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
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 touch-target w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg border-2 transition-colors ${
                      currentImageIndex === index ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                      </svg>
                    </div>
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
                <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {product.show}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">{product.category}</span>
              </div>
              <h1 className="text-mobile-h1 text-gray-900 margin-mobile">{product.name}</h1>
              <p className="text-mobile-body text-gray-600">{product.description}</p>
            </div>

            {/* Rating - Mobile optimized */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-mobile-body text-gray-600">
                {product.rating} ({product.reviews} reseñas)
              </span>
            </div>

            {/* Price - Prominent on mobile */}
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              ${product.price}
            </div>

            {/* Options - Mobile optimized */}
            <div className="space-y-4">
              {/* Size Selection */}
              {product.sizes.length > 1 && (
                <div>
                  <h3 className="text-mobile-body font-medium text-gray-900 mb-2">Talla</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`touch-target px-3 sm:px-4 py-2 border rounded-lg text-mobile-body font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 1 && (
                <div>
                  <h3 className="text-mobile-body font-medium text-gray-900 mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`touch-target px-3 sm:px-4 py-2 border rounded-lg text-mobile-body font-medium transition-colors ${
                          selectedColor === color
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity - Mobile optimized */}
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
            </div>

            {/* Action Buttons - Mobile optimized */}
            <div className="flex gap-3 sm:gap-4">
              <button 
                onClick={addToCart}
                className="flex-1 bg-blue-500 text-white touch-target rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-mobile-body font-medium"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Agregar al carrito</span>
                <span className="sm:hidden">Agregar</span>
              </button>
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
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-mobile-body text-gray-600">
                {product.inStock ? 'En stock' : 'Agotado'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details - Mobile optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-16">
          {/* Description */}
          <div>
            <h2 className="text-mobile-h2 text-gray-900 margin-mobile">Descripción</h2>
            <p className="text-mobile-body text-gray-600 leading-relaxed">{product.longDescription}</p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-mobile-h2 text-gray-900 margin-mobile">Características</h2>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-mobile-body text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Related Products - Mobile optimized */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-mobile-h2 text-gray-900 margin-mobile">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/producto/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                    </svg>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-mobile-body font-semibold text-gray-800 mb-1">{relatedProduct.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{relatedProduct.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {relatedProduct.show}
                      </span>
                      <p className="text-mobile-body font-bold text-gray-900">${relatedProduct.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Add to Cart Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-900">${product.price}</div>
            <div className="text-sm text-gray-600">
              {selectedSize && `Talla: ${selectedSize} • `}
              {selectedColor && `Color: ${selectedColor} • `}
              Cantidad: {quantity}
            </div>
          </div>
          <button 
            onClick={addToCart}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Agregar
          </button>
        </div>
      </div>

      {/* Add bottom padding to account for sticky button on mobile */}
      <div className="h-24 md:hidden"></div>

      <Footer />
    </div>
  );
};

export default ProductDetail; 