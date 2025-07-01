import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import ProgramDetail from './components/Programa'
import ProductosPage from './pages/ProductosPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/programas/:showName" element={<ProgramDetail />} />
        <Route path="/productos" element={<ProductosPage />} />
      </Routes>
    </Router>
  )
}

export default App 