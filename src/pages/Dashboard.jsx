import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { 
  Sparkles, 
  Package, 
  Star, 
  TrendingUp,
  Circle,
  Droplets,
  Sun,
  Moon,
  AlertCircle,
  TrendingUp as TrendingUpIcon,
  Shield,
  CheckCircle2,
  XCircle
} from 'lucide-react'

// Icon mapping for concerns (same as ResultsPage)
const concernIcons = {
  'redness': AlertCircle,
  'dark circles': Circle,
  'dryness': Droplets,
  'oil': TrendingUpIcon,
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
  return AlertCircle
}

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const [savedAnalysis, setSavedAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const isProfileView = location.pathname === '/profile'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    // If on /profile route, fetch saved analysis
    if (isProfileView && user) {
      const fetchSavedAnalysis = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('analysis_data, skin_type')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Error fetching saved analysis:', error)
          } else if (data?.analysis_data) {
            setSavedAnalysis(data.analysis_data)
          }
        } catch (err) {
          console.error('Error in fetchSavedAnalysis:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchSavedAnalysis()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, navigate, user, isProfileView])

  if (!isAuthenticated) {
    return null
  }

  // Show saved analysis results if on /profile and analysis exists
  if (isProfileView && savedAnalysis) {
    return (
      <div className="relative min-h-screen flex flex-col px-6 pt-32 pb-20">
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
              <span className="text-gradient">Your Skin Profile</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/50 font-light leading-relaxed"
            >
              Your saved skin analysis results
            </motion.p>
          </motion.div>

          {/* Bento Grid Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Skin Type Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="glass rounded-2xl p-8 md:col-span-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex">
                  <Circle size={32} strokeWidth={1} className="text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-white/50 mb-2 tracking-tight">Skin Type</h3>
                <p className="text-3xl font-bold tracking-tighter text-white mb-4">{savedAnalysis.skinType}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Shade: {savedAnalysis.tone?.shade || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <div className="w-2 h-2 rounded-full bg-pink-400" />
                    <span>Undertone: {savedAnalysis.tone?.undertone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Concerns Section */}
            {savedAnalysis.concerns && savedAnalysis.concerns.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                className="glass rounded-2xl p-8 md:col-span-8 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-white/50 mb-6 tracking-tight">Identified Concerns</h3>
                  <div className="flex flex-wrap gap-3">
                    {savedAnalysis.concerns.map((concern, index) => {
                      const Icon = getConcernIcon(concern)
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
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

            {/* Routine Section */}
            {savedAnalysis.routine && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
                className="md:col-span-12 glass rounded-2xl p-8 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-white/50 mb-6 tracking-tight">Recommended Routine</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedAnalysis.routine.am && savedAnalysis.routine.am.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Sun size={20} strokeWidth={1} className="text-yellow-400" />
                          <h4 className="text-lg font-semibold tracking-tight text-white">Morning</h4>
                        </div>
                        {savedAnalysis.routine.am.map((product, index) => (
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

                    {savedAnalysis.routine.pm && savedAnalysis.routine.pm.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Moon size={20} strokeWidth={1} className="text-indigo-400" />
                          <h4 className="text-lg font-semibold tracking-tight text-white">Evening</h4>
                        </div>
                        {savedAnalysis.routine.pm.map((product, index) => (
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
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Sparkles size={32} strokeWidth={1} className="text-purple-400 animate-pulse" />
          <p className="text-white/50 font-light">Loading...</p>
        </motion.div>
      </div>
    )
  }

  const quickLinks = [
    {
      title: 'Digital Vanity',
      description: 'Manage your product collection',
      icon: Package,
      path: '/vanity',
      gradient: 'from-pink-500/20 to-purple-500/20',
    },
    {
      title: 'Shade Matcher',
      description: 'Find your perfect foundation',
      icon: Star,
      path: '/products',
      gradient: 'from-purple-500/20 to-indigo-500/20',
    },
    {
      title: 'New Analysis',
      description: 'Start a fresh skin analysis',
      icon: TrendingUp,
      path: '/upload',
      gradient: 'from-indigo-500/20 to-pink-500/20',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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

  return (
    <div className="relative min-h-screen flex flex-col px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto w-full space-y-12"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
            <span className="text-gradient">Welcome Back</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed">
            {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
          </p>
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {quickLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <motion.div
                key={link.path}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(link.path)}
                className={`glass rounded-2xl p-8 relative overflow-hidden group cursor-pointer ${link.gradient}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex">
                    <Icon size={32} strokeWidth={1} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-white mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm text-white/60 font-light leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard