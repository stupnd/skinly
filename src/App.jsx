import { motion } from 'framer-motion'
import Background from './components/Background'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Process from './components/Process'

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />
      <Navigation />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Hero />
        <Process />
      </motion.main>
    </div>
  )
}

export default App