import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  MagnifyingGlassIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  FunnelIcon 
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedShow, setSelectedShow] = useState(searchParams.get('show') || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique shows for filter
  const shows = useMemo(() => {
    const uniqueShows = [...new Set(mockProducts.map(product => product.show))];
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
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set('search', value);
    } else {
      newSearchParams.delete('search');
    }
    setSearchParams(newSearchParams);
  };

  const handleShowFilter = (show: string) => {
    setSelectedShow(show);
    const newSearchParams = new URLSearchParams(searchParams);
    if (show !== 'all') {
      newSearchParams.set('show', show);
    } else {
      newSearchParams.delete('show');
    }
    setSearchParams(newSearchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todos los Productos</h1>
          <p className="text-gray-600">Descubre toda nuestra colección de productos oficiales</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              Filtros
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">Vista:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
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
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Grid View */}
                  <Link to={`/producto/${product.id}`} className="block">
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                      </svg>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">{product.name}</h3>
                        <p className="text-lg font-bold text-gray-900">${product.price}</p>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {product.show}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      Agregar al carrito
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* List View */}
                  <Link to={`/producto/${product.id}`} className="flex flex-grow items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">{product.name}</h3>
                        <p className="text-lg font-bold text-gray-900">${product.price}</p>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {product.show}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="ml-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      Agregar al carrito
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
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.095-5.583-2.709M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros o términos de búsqueda</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductosPage; 