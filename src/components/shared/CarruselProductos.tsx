import Link from 'next/link';
import CarouselContainer from './CarouselContainer';

// Featured products for the carousel
const products = [
  {
    id: 1,
    name: 'Camisa "Guardarme eso ahí"',
    description: 'Camiseta cómoda con el famoso catchphrase del programa',
    price: 25,
    showName: 'Día a Día',
    image: '',
  },
  {
    id: 2,
    name: 'Taza "Buenos días familia"',
    description: 'Taza de cerámica perfecta para el café matutino',
    price: 15,
    showName: 'Día a Día',
    image: '',
  },
  {
    id: 3,
    name: 'Gorra "Rayos X"',
    description: 'Gorra deportiva del programa de investigación',
    price: 20,
    showName: 'Rayos X',
    image: '',
  },
  {
    id: 5,
    name: 'Camisa "Rayos X Investigación"',
    description: 'Camisa oficial del equipo de investigación',
    price: 28,
    showName: 'Rayos X',
    image: '',
  },
  {
    id: 8,
    name: 'Hoodie "VeoPR"',
    description: 'Sudadera con capucha del canal',
    price: 35,
    showName: 'General',
    image: '',
  },
];

const CarruselProductos = ({ showName }: { showName?: string }) => {
  // Filter products based on showName prop
  const filteredProducts = showName 
    ? products.filter(product => product.showName === showName)
    : products;

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Productos</h2>
          <Link href="/productos" className="text-gray-500 hover:text-gray-900 underline">
            Ver todos
          </Link>
        </div>
        
        <CarouselContainer products={filteredProducts} />
      </div>
    </section>
  );
};

export default CarruselProductos; 