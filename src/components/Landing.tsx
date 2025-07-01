import Header from './Header'
import Hero from './Hero'
import Programas from './Programas'
import Mercancia from './Productos'
import Footer from './Footer'

function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Programas />
      <Mercancia />
      <Footer />
    </div>
  )
}

export default Landing 