import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { supabase } from './lib/supabaseClient'
import ProtectedRoute from './components/ProtectedRoute'
import Background from './components/Background'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Process from './components/Process'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import VanityPage from './pages/VanityPage'
import Stage5Products from './pages/Stage5Products'
import Dashboard from './pages/Dashboard'

function LandingPage() {
  return (
    <>
      <Hero />
      <Process />
    </>
  )
}

function App() {
  const [supabaseConnected, setSupabaseConnected] = useState(false)

  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)

        if (error) {
          console.error('Supabase connection error:', error)
          setSupabaseConnected(false)
        } else {
          console.log('Supabase Connected:', data)
          setSupabaseConnected(true)
        }
      } catch (err) {
        console.error('Supabase connection test failed:', err)
        setSupabaseConnected(false)
      }
    }

    testSupabaseConnection()
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen overflow-hidden flex flex-col">
          <Background />
          <Navigation />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1"
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route 
                path="/vanity" 
                element={
                  <ProtectedRoute>
                    <VanityPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/products" element={<Stage5Products />} />
              <Route path="/makeup-discovery" element={<Stage5Products />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </motion.main>

          {/* Footer with System Status */}
          <footer className="relative z-10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-end">
              <div className="flex items-center gap-2 text-xs text-white/40 font-light">
                <span>System Status</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-2 h-2 rounded-full ${
                    supabaseConnected ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App