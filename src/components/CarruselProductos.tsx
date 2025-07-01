import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Featured products for the carousel
const products = [
  {
    id: 1,
    name: 'Camisa "Guardarme eso ahí"',
    description: 'Camiseta cómoda con el famoso catchphrase del programa',
    price: 25,
    show: 'Día a Día',
    image: '', // Placeholder
  },
  {
    id: 2,
    name: 'Taza "Buenos días familia"',
    description: 'Taza de cerámica perfecta para el café matutino',
    price: 15,
    show: 'Día a Día',
    image: '', // Placeholder
  },
  {
    id: 3,
    name: 'Gorra "Rayos X"',
    description: 'Gorra deportiva del programa de investigación',
    price: 20,
    show: 'Rayos X',
    image: '', // Placeholder
  },
  {
    id: 5,
    name: 'Camisa "Rayos X Investigación"',
    description: 'Camisa oficial del equipo de investigación',
    price: 28,
    show: 'Rayos X',
    image: '', // Placeholder
  },
  {
    id: 8,
    name: 'Hoodie "VeoPR"',
    description: 'Sudadera con capucha del canal',
    price: 35,
    show: 'General',
    image: '', // Placeholder
  },
];

const Mercancia = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
    const walk = (x - startX) * 2; // scroll-fast
    container.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Productos</h2>
          <Link to="/productos" className="text-gray-500 hover:text-gray-900 underline">
            Ver todos
          </Link>
        </div>
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-6 pb-4 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' } as React.CSSProperties}
        >
          {products.map((product) => (
            <Link 
              key={product.id} 
              to={`/producto/${product.id}`}
              className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow select-none block"
              onClick={(e) => {
                // Prevent navigation if user was dragging
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
                  {product.show}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mercancia; 