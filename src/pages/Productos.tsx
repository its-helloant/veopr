'use client'

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { 
  MagnifyingGlassIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Mock data with more variety
const mockProducts = [
  {
    id: 1,
    name: 'Camisa "Guardarme eso ahí"',
    description: 'Camiseta cómoda con el famoso catchphrase del programa',
    price: 25,
    show: 'Día a Día',
    category: 'Ropa',
    image: '',
  },
  {
    id: 2,
    name: 'Taza "Buenos días familia"',
    description: 'Taza de cerámica perfecta para el café matutino',
    price: 15,
    show: 'Día a Día',
    category: 'Accesorios',
    image: '',
  },
  {
    id: 3,
    name: 'Gorra "Rayos X"',
    description: 'Gorra deportiva del programa de investigación',
    price: 20,
    show: 'Rayos X',
    category: 'Ropa',
    image: '',
  },
  {
    id: 4,
    name: 'Libreta "Apuntes médicos"',
    description: 'Libreta para tus notas importantes del programa',
    price: 12,
    show: 'Médicos por la Salud',
    category: 'Papelería',
    image: '',
  },
  {
    id: 5,
    name: 'Camisa "Rayos X Investigación"',
    description: 'Camisa oficial del equipo de investigación',
    price: 28,
    show: 'Rayos X',
    category: 'Ropa',
    image: '',
  },
  {
    id: 6,
    name: 'Termo "Día a Día"',
    description: 'Termo térmico para mantener tus bebidas a la temperatura perfecta',
    price: 22,
    show: 'Día a Día',
    category: 'Accesorios',
    image: '',
  },
  {
    id: 7,
    name: 'Stickers Pack "Médicos"',
    description: 'Pack de stickers del programa médico',
    price: 8,
    show: 'Médicos por la Salud',
    category: 'Accesorios',
    image: '',
  },
  {
    id: 8,
    name: 'Hoodie "VeoPR"',
    description: 'Sudadera con capucha del canal',
    price: 35,
    show: 'General',
    category: 'Ropa',
    image: '',
  },
];

const ProductosPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams?.get('search');
  const show = searchParams?.get('show');
  const [searchTerm, setSearchTerm] = useState(search || '');
  const [selectedShow, setSelectedShow] = useState(show || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  // Get unique shows for filter
  const shows = useMemo(() => {
    const uniqueShows = Array.from(new Set(mockProducts.map(product => product.show)));
    return ['all', ...uniqueShows];
  }, []);

  // Filter products based on search and show filter
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesShow = selectedShow === 'all' || product.show === selectedShow;
      return matchesSearch && matchesShow;
    });
  }, [searchTerm, selectedShow]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`/productos?${params.toString()}`);
  };

  const handleShowFilter = (show: string) => {
    setSelectedShow(show);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (show !== 'all') {
      params.set('show', show);
    } else {
      params.delete('show');
    }
    router.push(`/productos?${params.toString()}`);
    // Close mobile filter drawer after selection
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  // Pull to refresh functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchStartY;
    
    // If user scrolled down from top and pulled down more than 100px
    if (typeof window !== 'undefined' && window.scrollY === 0 && touchDiff > 100 && !isRefreshing) {
      handleRefresh();
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main 
        className="max-w-7xl mx-auto padding-mobile py-4 sm:py-8"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Pull to refresh indicator */}
        {isRefreshing && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg z-40 md:hidden">
            <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Page Header - Mobile optimized */}
        <div className="margin-mobile">
          <h1 className="text-mobile-h1 text-gray-900 margin-mobile">Todos los Productos</h1>
          <p className="text-mobile-body text-gray-600">Descubre toda nuestra colección de productos oficiales</p>
        </div>

        {/* Mobile-optimized Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 margin-mobile">
          {/* Search Bar - Mobile optimized */}
          <div className="relative margin-mobile">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-mobile-body"
              inputMode="search"
              autoComplete="off"
            />
          </div>

          {/* Mobile Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
            {/* Filter Button - Enhanced for mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="touch-target flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-mobile-body font-medium sm:justify-start"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filtros</span>
              {selectedShow !== 'all' && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">1</span>
              )}
            </button>

            {/* View Mode Toggle - Mobile optimized */}
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="text-mobile-body text-gray-600 mr-2">Vista:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`touch-target ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  aria-label="Vista de cuadrícula"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`touch-target ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  aria-label="Vista de lista"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowFilters(false)}
            />
            
            {/* Drawer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 md:hidden">
              <div className="p-4">
                {/* Drawer Header */}
                <div className="flex items-center justify-between margin-mobile">
                  <h3 className="text-mobile-h2 text-gray-900">Filtros</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="touch-target rounded-full hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                
                {/* Filter Content */}
                <div>
                  <h4 className="text-mobile-body font-medium text-gray-700 margin-mobile">Filtrar por programa:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {shows.map((show) => (
                      <button
                        key={show}
                        onClick={() => handleShowFilter(show)}
                        className={`touch-target px-3 py-2 rounded-lg text-mobile-body font-medium transition-colors ${
                          selectedShow === show
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {show === 'all' ? 'Todos' : show}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {selectedShow !== 'all' && (
                  <button
                    onClick={() => handleShowFilter('all')}
                    className="w-full mt-4 py-2 text-blue-500 text-mobile-body font-medium"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Desktop Filter Options */}
        {showFilters && (
          <div className="hidden md:block bg-white rounded-lg shadow-sm border p-4 sm:p-6 margin-mobile">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por programa:</h3>
            <div className="flex flex-wrap gap-2">
              {shows.map((show) => (
                <button
                  key={show}
                  onClick={() => handleShowFilter(show)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedShow === show
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {show === 'all' ? 'Todos' : show}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="margin-mobile">
          <p className="text-mobile-body text-gray-600">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid/List - Enhanced mobile responsiveness */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
            : 'space-y-4'
        }`}>
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex items-center p-3 sm:p-4' : 'overflow-hidden flex flex-col h-full'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Enhanced Grid View for Mobile */}
                  <Link href={`/productos/${product.id}`} className="block flex-grow flex flex-col">
                    <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                      </svg>
                    </div>
                    <div className="p-3 sm:p-4 flex-grow flex flex-col">
                      <div className="flex justify-between items-start margin-mobile">
                        <h3 className="text-mobile-body font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h3>
                        <p className="text-mobile-body font-bold text-gray-900 ml-2">${product.price}</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 margin-mobile flex-grow line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {product.show}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 mt-auto">
                    <button className="w-full bg-blue-500 text-white touch-target rounded-lg hover:bg-blue-600 transition-colors text-mobile-body font-medium">
                      Agregar al carrito
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Enhanced List View for Mobile */}
                  <Link href={`/productos/${product.id}`} className="flex flex-grow items-center min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 sm:mr-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                      </svg>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-mobile-body font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 pr-2">{product.name}</h3>
                        <p className="text-mobile-body font-bold text-gray-900 flex-shrink-0">${product.price}</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-1">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {product.show}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="ml-2 sm:ml-4 flex-shrink-0">
                    <button className="bg-blue-500 text-white touch-target rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium px-3 sm:px-4">
                      Agregar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto margin-mobile" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.095-5.583-2.709M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path>
            </svg>
            <h3 className="text-mobile-h2 text-gray-700 margin-mobile">No se encontraron productos</h3>
            <p className="text-mobile-body text-gray-500">Intenta ajustar tus filtros o términos de búsqueda</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductosPage; 