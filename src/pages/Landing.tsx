import Header from '../components/Header'
import Hero from '../components/Hero'
import Programas from '../components/CarruselProgramas'
import CarruselProductos from '../components/CarruselProductos'
import Footer from '../components/Footer'

function Landing() {
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

export default Landing 