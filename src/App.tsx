import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import ProgramDetail from './components/Programa'
import ProductosPage from './pages/Productos'
import ProductDetail from './pages/ProductDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/programas/:showName" element={<ProgramDetail />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  )
}

export default App 