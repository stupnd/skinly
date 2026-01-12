import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, LayoutDashboard } from 'lucide-react'

const Hero = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl mx-auto text-center space-y-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none"
        >
          <span className="text-gradient">AI-Powered</span>
          <br />
          <span className="text-white">Skin Analysis</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed"
        >
          Your Digital Vanity. Precision skin insights powered by advanced AI vision technology.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="pt-4"
        >
          <motion.button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/upload')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative glass rounded-full px-8 py-4 text-base font-medium tracking-tight flex items-center gap-3 mx-auto transition-colors hover:bg-white/10 animate-breathe"
          >
            <span className="relative z-10">
              {isAuthenticated ? 'Go to My Dashboard' : 'Begin Analysis'}
            </span>
            {isAuthenticated ? (
              <LayoutDashboard 
                size={18} 
                strokeWidth={1} 
                className="relative z-10 transition-transform group-hover:scale-110" 
              />
            ) : (
              <ArrowRight 
                size={18} 
                strokeWidth={1} 
                className="relative z-10 transition-transform group-hover:translate-x-1" 
              />
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero