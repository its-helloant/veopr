import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

// Featured products for the carousel
const products = [
  {
    id: 1,
    name: 'Camisa "Guardarme eso ahí"',
    description: 'Camiseta cómoda con el famoso catchphrase del programa',
    price: 25,
    showName: 'Día a Día',
    image: '', // Placeholder
  },
  {
    id: 2,
    name: 'Taza "Buenos días familia"',
    description: 'Taza de cerámica perfecta para el café matutino',
    price: 15,
    showName: 'Día a Día',
    image: '', // Placeholder
  },
  {
    id: 3,
    name: 'Gorra "Rayos X"',
    description: 'Gorra deportiva del programa de investigación',
    price: 20,
    showName: 'Rayos X',
    image: '', // Placeholder
  },
  {
    id: 5,
    name: 'Camisa "Rayos X Investigación"',
    description: 'Camisa oficial del equipo de investigación',
    price: 28,
    showName: 'Rayos X',
    image: '', // Placeholder
  },
  {
    id: 8,
    name: 'Hoodie "VeoPR"',
    description: 'Sudadera con capucha del canal',
    price: 35,
    showName: 'General',
    image: '', // Placeholder
  },
];

const CarruselProductos = ({ showName }: { showName?: string }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(300); // Default fallback width
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter products based on showName prop
  const filteredProducts = showName 
    ? products.filter(product => product.showName === showName)
    : products;

  // Calculate card width and current index on scroll
  useEffect(() => {
    if (!isClient) return;

    const updateCardWidth = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      // Responsive card widths: mobile: 85%, tablet: 45%, desktop: 30%
      const width = window.innerWidth < 640 ? containerWidth * 0.85 : 
                   window.innerWidth < 1024 ? containerWidth * 0.45 : 
                   containerWidth * 0.30;
      setCardWidth(width);
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, [isClient]);

  // Update current index based on scroll position
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container || cardWidth === 0) return;
      
      const scrollPos = container.scrollLeft;
      const index = Math.round(scrollPos / (cardWidth + 16)); // 16px is gap
      setCurrentIndex(Math.min(index, filteredProducts.length - 1));
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [cardWidth, filteredProducts.length, isClient]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDown(true);
    container.classList.add('active');
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleMouseLeave = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDown(false);
    container.classList.remove('active');
  };

  const handleMouseUp = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDown(false);
    container.classList.remove('active');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDown(true);
    setStartX(e.touches[0].pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDown) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDown(false);
  };

  // Navigation functions
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container || cardWidth === 0) return;
    
    const scrollPos = index * (cardWidth + 16);
    container.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollToNext = () => {
    if (currentIndex < filteredProducts.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Productos</h2>
          <Link href="/productos" className="text-gray-500 hover:text-gray-900 underline">
            Ver todos
          </Link>
        </div>
        
        {/* Carousel container with navigation */}
        <div className="relative">
          {/* Navigation arrows - only show if more than 3 products */}
          {filteredProducts.length > 3 && (
            <>
              <button 
                onClick={scrollToPrevious}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ transform: 'translateY(-50%)' }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={scrollToNext}
                disabled={currentIndex >= filteredProducts.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ transform: 'translateY(-50%)' }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Carousel */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 cursor-grab active:cursor-grabbing scrollbar-hide"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory'
            } as React.CSSProperties}
          >
            {filteredProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/producto/${product.id}`}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow select-none block"
                style={{ 
                  width: `${cardWidth}px`,
                  scrollSnapAlign: 'start'
                }}
                onClick={(e) => {
                  if (isDown) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path>
                  </svg>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">{product.name}</h3>
                    <p className="text-lg font-bold text-gray-900">${product.price}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {product.showName}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Touch indicators/dots */}
        <div className="flex justify-center mt-4 gap-2">
          {filteredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarruselProductos; 