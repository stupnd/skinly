import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Sparkles, User, LogOut } from 'lucide-react'
import LoginDrawer from './LoginDrawer'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, signOut } = useAuth()
  const [showLoginDrawer, setShowLoginDrawer] = useState(false)

  const handleLogout = () => {
    signOut()
    navigate('/')
  }

  return (
    <>
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
          <Link 
            to="/products"
            className={`text-xs font-medium tracking-tight transition-colors ${
              location.pathname === '/products' || location.pathname === '/makeup-discovery'
                ? 'text-purple-400' 
                : 'text-white/60 hover:text-white/90'
            }`}
          >
            Shade Match
          </Link>
          
          {isAuthenticated ? (
            <>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="text-xs font-medium tracking-tight text-white/80">
                  {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                </div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={14} strokeWidth={1} className="text-white/60 hover:text-white transition-colors" />
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <div className="h-4 w-px bg-white/20" />
              <motion.button
                onClick={() => setShowLoginDrawer(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs font-medium tracking-tight text-white/60 hover:text-white/90 transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/10 rounded-full"
              >
                <User size={14} strokeWidth={1} />
                <span>Sign In</span>
              </motion.button>
            </>
          )}
        </div>
      </motion.nav>

      <LoginDrawer isOpen={showLoginDrawer} onClose={() => setShowLoginDrawer(false)} />
    </>
  )
}

export default Navigation