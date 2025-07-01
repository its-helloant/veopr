import React from 'react';

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
  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Mercancia</h2>
          <a href="#" className="text-gray-500 hover:text-gray-900 underline">
            Ver todos
          </a>
        </div>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-md">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path></svg>
              </div>
              <div className="p-4">
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