import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Programs from './components/Programs'
import Footer from './components/Footer'
import ProgramDetail from './components/ProgramDetail'

function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Programs />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/programs/:showName" element={<ProgramDetail />} />
      </Routes>
    </Router>
  )
}

export default App 