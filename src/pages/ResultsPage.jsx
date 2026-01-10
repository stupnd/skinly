import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const ResultsPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex mb-6"
        >
          <Sparkles size={64} strokeWidth={1} className="text-purple-400" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-bold tracking-tighter"
        >
          <span className="text-gradient">Analysis Results</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/50 font-light leading-relaxed"
        >
          AI analysis results will appear here
        </motion.p>
      </motion.div>
    </div>
  )
}

export default ResultsPage