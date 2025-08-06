import Header from '../../src/components/layout/Header'
import Hero from '../../src/components/features/Hero'
import Programas from '../../src/components/features/CarruselProgramas'
import CarruselProductos from '../../src/components/features/CarruselProductos'
import Footer from '../../src/components/layout/Footer'

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