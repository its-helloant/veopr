import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Programa no encontrado</h2>
          <p className="text-gray-600 mb-8">El programa que buscas no existe.</p>
          <a 
            href="/#programas" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ver todos los programas
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
