import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import LoginDrawer from '../components/LoginDrawer'
import { 
  Sparkles, 
  Circle, 
  Droplets, 
  Sun, 
  Moon, 
  AlertCircle, 
  TrendingUp,
  Shield,
  CheckCircle2,
  XCircle,
  Star
} from 'lucide-react'

// Icon mapping for concerns
const concernIcons = {
  'redness': AlertCircle,
  'dark circles': Circle,
  'dryness': Droplets,
  'oil': TrendingUp,
  'acne': XCircle,
  'texture': Shield,
  'hyperpigmentation': Sun,
  'wrinkles': Circle,
  'pores': Circle,
  'spots': Sun,
  'fine lines': AlertCircle,
}

const getConcernIcon = (concern) => {
  const lowerConcern = concern.toLowerCase()
  for (const [key, icon] of Object.entries(concernIcons)) {
    if (lowerConcern.includes(key)) {
      return icon
    }
  }
  return AlertCircle // Default icon
}

const ResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { analysis, preview } = location.state || {}
  const { isAuthenticated } = useAuth()
  const [isScanning, setIsScanning] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [showLoginDrawer, setShowLoginDrawer] = useState(false)

  useEffect(() => {
    if (!preview) {
      // If no preview image, redirect back to upload
      navigate('/upload')
      return
    }

    if (analysis) {
      // Save analysis to localStorage for Vanity page
      localStorage.setItem('skinAnalysis', JSON.stringify(analysis))
      
      // If analysis is already available, show scanning briefly then reveal results
      const scanningTimeout = setTimeout(() => {
        setIsScanning(false)
        setShowResults(true)
      }, 2000) // Brief scanning animation

      return () => clearTimeout(scanningTimeout)
    } else {
      // If no analysis yet, keep scanning (this shouldn't happen in normal flow)
      setIsScanning(true)
    }
  }, [analysis, preview, navigate])

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const concernVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  }

  if (!analysis && !preview) {
    return null
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto w-full space-y-12"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-center space-y-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold tracking-tighter"
          >
            <span className="text-gradient">Analysis Complete</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/50 font-light leading-relaxed"
          >
            Your personalized skin insights
          </motion.p>
        </motion.div>

        {/* Image with Scanning Line */}
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative glass rounded-3xl p-8 overflow-hidden"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5">
              <img
                src={preview}
                alt="Analysis"
                className="w-full h-full object-cover"
              />
              
              {/* Scanning Line Animation */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ y: 0, opacity: 0.8 }}
                    animate={{ y: '100%', opacity: [0.8, 1, 0.8] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      opacity: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_rgba(192,132,252,0.8)]"
                    style={{ boxShadow: '0 0 40px rgba(192, 132, 252, 0.8)' }}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Analysis Results - Staggered Reveal */}
        {analysis && showResults && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Skin Type Card - First Reveal */}
            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-8 md:col-span-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex">
                  <Circle size={32} strokeWidth={1} className="text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-white/50 mb-2 tracking-tight">Skin Type</h3>
                <p className="text-3xl font-bold tracking-tighter text-white mb-4">{analysis.skinType}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Shade: {analysis.tone?.shade || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <div className="w-2 h-2 rounded-full bg-pink-400" />
                    <span>Undertone: {analysis.tone?.undertone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Concerns Section - Second Reveal */}
            {analysis.concerns && analysis.concerns.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="glass rounded-2xl p-8 md:col-span-8 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-white/50 mb-6 tracking-tight">Identified Concerns</h3>
                  <div className="flex flex-wrap gap-3">
                    {analysis.concerns.map((concern, index) => {
                      const Icon = getConcernIcon(concern)
                      return (
                        <motion.div
                          key={index}
                          variants={concernVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="glass rounded-full px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors"
                        >
                          <Icon size={16} strokeWidth={1} className="text-purple-400" />
                          <span className="text-sm font-medium tracking-tight text-white/90">{concern}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Routine Section - Third Reveal (Expands) */}
            {analysis.routine && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 0.8
                }}
                className="md:col-span-12 glass rounded-2xl p-8 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-white/50 mb-6 tracking-tight">Recommended Routine</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* AM Routine */}
                    {analysis.routine.am && analysis.routine.am.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, type: "spring", stiffness: 100 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Sun size={20} strokeWidth={1} className="text-yellow-400" />
                          <h4 className="text-lg font-semibold tracking-tight text-white">Morning</h4>
                        </div>
                        {analysis.routine.am.map((product, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 + index * 0.1 }}
                            className="flex items-center gap-3 glass rounded-xl p-4 hover:bg-white/10 transition-colors"
                          >
                            <CheckCircle2 size={18} strokeWidth={1} className="text-green-400 flex-shrink-0" />
                            <span className="text-sm font-medium tracking-tight text-white/90">{product}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* PM Routine */}
                    {analysis.routine.pm && analysis.routine.pm.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, type: "spring", stiffness: 100 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Moon size={20} strokeWidth={1} className="text-indigo-400" />
                          <h4 className="text-lg font-semibold tracking-tight text-white">Evening</h4>
                        </div>
                        {analysis.routine.pm.map((product, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 + index * 0.1 }}
                            className="flex items-center gap-3 glass rounded-xl p-4 hover:bg-white/10 transition-colors"
                          >
                            <CheckCircle2 size={18} strokeWidth={1} className="text-purple-400 flex-shrink-0" />
                            <span className="text-sm font-medium tracking-tight text-white/90">{product}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Disclaimer */}
            {analysis.disclaimer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="md:col-span-12 glass rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <Shield size={20} strokeWidth={1} className="text-white/40 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-white/40 font-light leading-relaxed">{analysis.disclaimer}</p>
                </div>
              </motion.div>
            )}

            {/* Navigate to Vanity and Shade Match / Save Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="md:col-span-12 flex flex-wrap justify-center gap-4 pt-4"
            >
              {!isAuthenticated ? (
                <motion.button
                  onClick={() => setShowLoginDrawer(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass rounded-full px-8 py-4 text-base font-medium tracking-tight flex items-center gap-3 hover:bg-white/10 transition-colors animate-breathe"
                >
                  <Sparkles size={18} strokeWidth={1} className="text-purple-400" />
                  <span>Save Progress</span>
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={() => navigate('/vanity')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass rounded-full px-8 py-4 text-base font-medium tracking-tight flex items-center gap-3 hover:bg-white/10 transition-colors animate-breathe"
                  >
                    <Sparkles size={18} strokeWidth={1} className="text-purple-400" />
                    <span>View Your Digital Vanity</span>
                  </motion.button>
                  
                  {analysis.tone && (
                    <motion.button
                      onClick={() => navigate('/products')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="glass rounded-full px-8 py-4 text-base font-medium tracking-tight flex items-center gap-3 hover:bg-white/10 transition-colors"
                    >
                      <Star size={18} strokeWidth={1} className="text-yellow-400" fill="currentColor" />
                      <span>Find Your Perfect Shade</span>
                    </motion.button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Login Drawer */}
      <LoginDrawer isOpen={showLoginDrawer} onClose={() => setShowLoginDrawer(false)} />
    </div>
  )
}

export default ResultsPage