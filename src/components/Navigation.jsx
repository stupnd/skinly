import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const Navigation = () => {
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
      <div className="glass rounded-full px-6 py-3 flex items-center gap-3">
        <Sparkles size={18} strokeWidth={1} className="text-purple-400" />
        <span className="text-sm font-medium tracking-tight">Skinly</span>
      </div>
    </motion.nav>
  )
}

export default Navigation