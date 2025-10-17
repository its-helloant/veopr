'use client'

import React from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useProductFilters } from '@/hooks/useProductFilters';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useProductActions } from '@/hooks/useProductActions';
import { ProductsSearchBar } from '@/components/productos/ProductsSearchBar';
import { ProductsFilterDrawer } from '@/components/productos/ProductsFilterDrawer';
import { ProductsGrid } from '@/components/productos/ProductsGrid';
import { PullToRefreshIndicator } from '@/components/productos/PullToRefreshIndicator';

const ProductosPage = () => {
  const { products, loading: productsLoading, refetch } = useProducts();
  const { addItem, isPending: cartLoading } = useCart();
  
  const {
    searchTerm,
    selectedCategory,
    categories,
    filteredProducts,
    showFilters,
    viewMode,
    handleSearch,
    handleCategoryFilter,
    setShowFilters,
    setViewMode,
  } = useProductFilters(products);
  
  const {
    isRefreshing,
    handleTouchStart,
    handleTouchMove,
  } = usePullToRefresh(refetch);
  
  const {
    handleProductAction,
    getActionButton,
  } = useProductActions(addItem, cartLoading);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main 
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-8"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <PullToRefreshIndicator isRefreshing={isRefreshing} />

        {/* Page Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
            Todos los Productos
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Descubre toda nuestra colección de productos oficiales
          </p>
        </div>

        <ProductsSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          selectedCategory={selectedCategory}
          filterCount={selectedCategory !== 'all' ? 1 : 0}
        />

        <ProductsFilterDrawer
          showFilters={showFilters}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategoryFilter}
          onClose={() => setShowFilters(false)}
        />

        <ProductsGrid
          products={filteredProducts}
          loading={productsLoading}
          viewMode={viewMode}
          onProductAction={handleProductAction}
          getButtonConfig={getActionButton}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ProductosPage; 