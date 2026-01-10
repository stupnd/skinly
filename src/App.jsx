import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Background from './components/Background'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Process from './components/Process'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import VanityPage from './pages/VanityPage'

function LandingPage() {
  return (
    <>
      <Hero />
      <Process />
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden">
        <Background />
        <Navigation />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/vanity" element={<VanityPage />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  )
}

export default App