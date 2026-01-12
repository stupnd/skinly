import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Package, Star, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
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
            {user?.name || user?.email?.split('@')[0] || 'User'}
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