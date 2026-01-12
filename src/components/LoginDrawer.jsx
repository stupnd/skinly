import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { X, Mail, Lock, User, Loader, CheckCircle2, AlertCircle } from 'lucide-react'

const LoginDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const showErrorToast = (message) => {
    setError(message)
    setTimeout(() => setError(''), 5000)
  }

  const showSuccessToast = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  const handleLogin = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        showErrorToast(error.message || 'Failed to sign in. Please check your credentials.')
        return false
      }

      if (data.user) {
        // Reset form
        setFormData({ name: '', email: '', password: '' })
        onClose()
        // Navigate to dashboard
        navigate('/dashboard')
        return true
      }
    } catch (err) {
      showErrorToast(err.message || 'An unexpected error occurred. Please try again.')
      return false
    }
  }

  const handleSignUp = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      })

      if (error) {
        showErrorToast(error.message || 'Failed to create account. Please try again.')
        return false
      }

      if (data.user) {
        // Show success message about email confirmation
        showSuccessToast('Account created! Please check your email for a confirmation link.')
        // Reset form
        setFormData({ name: '', email: '', password: '' })
        // Switch to sign in mode after a delay
        setTimeout(() => {
          setIsSignUp(false)
        }, 3000)
        return true
      }
    } catch (err) {
      showErrorToast(err.message || 'An unexpected error occurred. Please try again.')
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    try {
      if (isSignUp) {
        await handleSignUp(formData.email, formData.password, formData.name)
      } else {
        await handleLogin(formData.email, formData.password)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '' })
    setError('')
    setIsSignUp(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass border-l border-white/10 shadow-2xl overflow-y-auto"
          >
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tighter text-white">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-sm text-white/50 font-light mt-1">
                    {isSignUp ? 'Save your skin analysis and vanity' : 'Sign in to save your progress'}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} strokeWidth={1} className="text-white/60" />
                </button>
              </div>

              {/* Error Toast */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="fixed top-6 right-6 z-[60] glass rounded-2xl p-4 bg-red-500/20 border border-red-500/50 backdrop-blur-xl shadow-2xl max-w-sm"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} strokeWidth={1} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300 font-light leading-relaxed">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Toast */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="fixed top-6 right-6 z-[60] glass rounded-2xl p-4 bg-green-500/20 border border-green-500/50 backdrop-blur-xl shadow-2xl max-w-sm"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} strokeWidth={1} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-300 font-light leading-relaxed">{successMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2 tracking-tight">
                      Name
                    </label>
                    <div className="relative">
                      <User 
                        size={18} 
                        strokeWidth={1} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" 
                      />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required={isSignUp}
                        className="w-full glass rounded-xl pl-12 pr-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:border-purple-400/50 focus:outline-none transition-colors placeholder-white/30"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-tight">
                    Email
                  </label>
                  <div className="relative">
                    <Mail 
                      size={18} 
                      strokeWidth={1} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" 
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full glass rounded-xl pl-12 pr-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:border-purple-400/50 focus:outline-none transition-colors placeholder-white/30"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-tight">
                    Password
                  </label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      strokeWidth={1} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" 
                    />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      className="w-full glass rounded-xl pl-12 pr-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:border-purple-400/50 focus:outline-none transition-colors placeholder-white/30"
                      placeholder="••••••••"
                    />
                  </div>
                  {isSignUp && (
                    <p className="text-xs text-white/40 font-light mt-1">
                      Minimum 6 characters
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full glass rounded-full px-6 py-4 text-sm font-medium tracking-tight flex items-center justify-center gap-3 hover:bg-white/10 transition-colors animate-breathe disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader size={18} strokeWidth={1} className="animate-spin text-purple-400" />
                      <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} strokeWidth={1} />
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Toggle Sign Up/Sign In */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-sm text-white/50 font-light">
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError('')
                      setFormData({ name: '', email: '', password: '' })
                    }}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default LoginDrawer
