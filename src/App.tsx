import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import ProgramDetail from './components/Programa'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/programas/:showName" element={<ProgramDetail />} />
      </Routes>
    </Router>
  )
}

export default App 