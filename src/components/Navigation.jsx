import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const Navigation = () => {
  const location = useLocation()
  
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.2
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass rounded-full px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Sparkles size={18} strokeWidth={1} className="text-purple-400" />
          <span className="text-sm font-medium tracking-tight">Skinly</span>
        </Link>
        <div className="h-4 w-px bg-white/20" />
        <Link 
          to="/vanity"
          className={`text-xs font-medium tracking-tight transition-colors ${
            location.pathname === '/vanity' 
              ? 'text-purple-400' 
              : 'text-white/60 hover:text-white/90'
          }`}
        >
          Vanity
        </Link>
      </div>
    </motion.nav>
  )
}

export default Navigation