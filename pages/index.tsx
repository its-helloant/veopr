// Import components normally since they now have proper client-side checks
import Header from '../src/components/Header'
import Hero from '../src/components/Hero'
import Programas from '../src/components/CarruselProgramas'
import CarruselProductos from '../src/components/CarruselProductos'
import Footer from '../src/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Programas />
      <CarruselProductos />
      <Footer />
    </div>
  )
} 