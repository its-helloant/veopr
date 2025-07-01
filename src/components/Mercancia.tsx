import React, { useRef, useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Camisa "Guardame eso ahi"',
    description: 'Descripcion de camisa o frase',
    price: 20,
    image: '', // Placeholder
  },
  {
    id: 2,
    name: 'Camisa "Guardame eso ahi"',
    description: 'Descripcion de camisa o frase',
    price: 20,
    image: '', // Placeholder
  },
  {
    id: 3,
    name: 'Camisa "Guardame eso ahi"',
    description: 'Descripcion de camisa o frase',
    price: 20,
    image: '', // Placeholder
  },
  {
    id: 4,
    name: 'Camisa "Guardame eso ahi"',
    description: 'Descripcion de camisa o frase',
    price: 20,
    image: '', // Placeholder
  },
  {
    id: 5,
    name: 'Camisa "Guardame eso ahi"',
    description: 'Descripcion de camisa o frase',
    price: 20,
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
          <h2 className="text-4xl font-bold">Mercancia</h2>
          <a href="#" className="text-gray-500 hover:text-gray-900 underline">
            Ver todos
          </a>
        </div>
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-6 pb-4 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-md select-none">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center pointer-events-none">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path></svg>
              </div>
              <div className="p-4 pointer-events-none">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-lg font-bold text-gray-900">${product.price}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mercancia; 