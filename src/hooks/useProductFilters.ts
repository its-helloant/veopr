import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';

export function useProductFilters(products: Product[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams?.get('search');
  const category = searchParams?.get('category');
  
  const [searchTerm, setSearchTerm] = useState(search || '');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map(product => product.productType).filter(Boolean))
    );
    return ['all', ...uniqueCategories];
  }, [products]);

  // Filter products based on search and category filter
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = 
        selectedCategory === 'all' || product.productType === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`/productos?${params.toString()}`);
  }, [searchParams, router]);

  const handleCategoryFilter = useCallback((category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/productos?${params.toString()}`);
    // Close mobile filter drawer after selection
    if (isMobile) {
      setShowFilters(false);
    }
  }, [searchParams, router, isMobile]);

  return {
    searchTerm,
    selectedCategory,
    categories,
    filteredProducts,
    viewMode,
    setViewMode,
    showFilters,
    setShowFilters,
    handleSearch,
    handleCategoryFilter,
  };
}
