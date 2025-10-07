'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { StarIcon } from '@heroicons/react/24/outline';
import ProductImageCarousel from './ProductImageCarousel';
import ProductOptions from './ProductOptions';
import BackButton from './BackButton';

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

interface ProductDetailClientProps {
  params?: Promise<{
    id?: string;
  }>;
}

export default function ProductDetailClient({ params }: ProductDetailClientProps) {
  const [id, setId] = useState<string>('');

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto padding-mobile py-4 sm:py-8">
        {/* Breadcrumb - Hidden on mobile */}
        <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-600 margin-mobile">
          <Link href="/" className="hover:text-blue-500">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-blue-500">Productos</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <BackButton />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-16">
          {/* Product Images */}
          <ProductImageCarousel images={product.images} />

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
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

            {/* Rating */}
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

            {/* Price */}
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              ${product.price}
            </div>

            {/* Product Options Component */}
            <ProductOptions 
              sizes={product.sizes}
              colors={product.colors}
              price={product.price}
            />

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-mobile-body text-gray-600">
                {product.inStock ? 'En stock' : 'Agotado'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-16">
          <div>
            <h2 className="text-mobile-h2 text-gray-900 margin-mobile">Descripción</h2>
            <p className="text-mobile-body text-gray-600 leading-relaxed">{product.longDescription}</p>
          </div>

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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-mobile-h2 text-gray-900 margin-mobile">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/productos/${relatedProduct.id}`}
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

      {/* Add bottom padding for sticky button */}
      <div className="h-24 md:hidden"></div>

      <Footer />
    </div>
  );
}

