import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { 
  Sparkles, 
  Plus, 
  X, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  Droplets,
  FlaskConical,
  Package,
  Palette,
  Loader
} from 'lucide-react'

// Conflict checker: Maps ingredients to concerns they can worsen
const ingredientConflicts = {
  'alcohol denat': ['redness', 'dryness', 'irritation'],
  'alcohol': ['redness', 'dryness', 'irritation'],
  'fragrance': ['redness', 'sensitivity', 'irritation'],
  'parfum': ['redness', 'sensitivity', 'irritation'],
  'sulfate': ['dryness', 'redness'],
  'retinol': ['sensitivity', 'redness'],
  'aha': ['sensitivity', 'redness'],
  'bha': ['sensitivity', 'redness'],
  'acid': ['sensitivity', 'redness'],
  'benzoyl peroxide': ['dryness', 'redness'],
  'salicylic acid': ['dryness', 'redness'],
  'witch hazel': ['dryness', 'redness'],
  'citrus': ['sensitivity', 'redness'],
  'lemon': ['sensitivity', 'redness'],
  'lime': ['sensitivity', 'redness'],
}

const categoryIcons = {
  'Cleansers': Droplets,
  'Serums': FlaskConical,
  'Moisturizers': Package,
  'Makeup': Palette,
}

const checkProductConflicts = (productName, ingredients, concerns) => {
  if (!concerns || concerns.length === 0) return []
  
  const conflicts = []
  const productText = `${productName} ${ingredients || ''}`.toLowerCase()
  
  Object.entries(ingredientConflicts).forEach(([ingredient, conflictConcerns]) => {
    if (productText.includes(ingredient)) {
      // Check if any of the user's concerns match the ingredient's conflict concerns
      concerns.forEach(concern => {
        const lowerConcern = concern.toLowerCase()
        const matchedConflict = conflictConcerns.find(cc => lowerConcern.includes(cc))
        
        if (matchedConflict) {
          // Avoid duplicates
          if (!conflicts.some(c => c.ingredient === ingredient && c.concern === concern)) {
            conflicts.push({
              ingredient,
              concern,
              reason: `${ingredient} may worsen ${concern.toLowerCase()}`
            })
          }
        }
      })
    }
  })
  
  return conflicts
}

const VanityPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [concerns, setConcerns] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Cleansers')
  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    category: 'Cleansers',
    ingredients: '',
    expiryDate: ''
  })

  useEffect(() => {
    const checkAuthAndFetchProducts = async () => {
      try {
        // Check for active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error checking session:', sessionError)
          navigate('/')
          return
        }

        if (!session) {
          // No active session, redirect to login
          navigate('/')
          return
        }

        // Load concerns from last analysis (still using localStorage for now)
        const savedAnalysis = localStorage.getItem('skinAnalysis')
        if (savedAnalysis) {
          const analysis = JSON.parse(savedAnalysis)
          if (analysis.concerns) {
            setConcerns(analysis.concerns)
          }
        }

        // Fetch products from Supabase
        const { data, error } = await supabase
          .from('user_products')
          .select('*')
          .eq('user_id', session.user.id)
          .order('added_date', { ascending: false })

        if (error) {
          console.error('Error fetching products:', error)
        } else {
          // Transform Supabase data to match component format
          const transformedProducts = data.map(product => ({
            id: product.id,
            brand: product.brand,
            name: product.name,
            category: product.category,
            ingredients: product.ingredients || '',
            expiryDate: product.expiry_date || '',
            addedDate: product.added_date,
            conflicts: product.conflicts || []
          }))
          setProducts(transformedProducts)
        }
      } catch (error) {
        console.error('Error in checkAuthAndFetchProducts:', error)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchProducts()
  }, [navigate])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    
    if (!formData.brand || !formData.name) {
      return
    }

    setSaving(true)

    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error('No active session')
        navigate('/')
        return
      }

      // Calculate conflicts
      const conflicts = checkProductConflicts(formData.name, formData.ingredients, concerns)

      // Insert product into Supabase
      const { data, error } = await supabase
        .from('user_products')
        .insert([
          {
            user_id: session.user.id,
            brand: formData.brand,
            name: formData.name,
            category: formData.category,
            ingredients: formData.ingredients || null,
            expiry_date: formData.expiryDate || null,
            conflicts: conflicts,
            added_date: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error adding product:', error)
        alert('Failed to add product. Please try again.')
      } else {
        // Add to local state
        const newProduct = {
          id: data.id,
          brand: data.brand,
          name: data.name,
          category: data.category,
          ingredients: data.ingredients || '',
          expiryDate: data.expiry_date || '',
          addedDate: data.added_date,
          conflicts: data.conflicts || []
        }
        setProducts([newProduct, ...products])
        
        // Reset form
        setFormData({
          brand: '',
          name: '',
          category: 'Cleansers',
          ingredients: '',
          expiryDate: ''
        })
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error in handleAddProduct:', error)
      alert('Failed to add product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('user_products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product. Please try again.')
      } else {
        // Remove from local state
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error in handleDeleteProduct:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  const getProductsByCategory = (category) => {
    return products.filter(p => p.category === category)
  }

  const categories = ['Cleansers', 'Serums', 'Moisturizers', 'Makeup']

  // Show loading state while checking auth and fetching products
  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader size={32} strokeWidth={1} className="text-purple-400 animate-spin" />
          <p className="text-white/50 font-light">Loading your vanity...</p>
        </motion.div>
      </div>
    )
  }

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
          className="flex items-center justify-between"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
              <span className="text-gradient">Digital Vanity</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed">
              Your personalized product collection
            </p>
          </div>
          
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass rounded-full px-6 py-3 text-sm font-medium tracking-tight flex items-center gap-2 hover:bg-white/10 transition-colors animate-breathe"
          >
            <Plus size={18} strokeWidth={1} />
            <span>Add Product</span>
          </motion.button>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {categories.map((category, index) => {
            const categoryProducts = getProductsByCategory(category)
            const Icon = categoryIcons[category]
            const colSpans = index === 0 ? 'md:col-span-5' : index === 1 ? 'md:col-span-4' : index === 2 ? 'md:col-span-3' : 'md:col-span-12'
            const colStarts = index === 0 ? 'md:col-start-1' : index === 1 ? 'md:col-start-6' : index === 2 ? 'md:col-start-10' : 'md:col-start-1'

            return (
              <motion.div
                key={category}
                variants={itemVariants}
                className={`glass rounded-2xl p-6 md:p-8 relative overflow-hidden group ${colSpans} ${colStarts}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-pink-500/10 to-purple-500/10' : 'from-purple-500/10 to-indigo-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    {Icon && <Icon size={24} strokeWidth={1} className="text-purple-400" />}
                    <h2 className="text-xl font-semibold tracking-tight text-white">{category}</h2>
                    <span className="text-sm text-white/40 font-light">({categoryProducts.length})</span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {categoryProducts.length === 0 ? (
                      <p className="text-sm text-white/30 font-light italic">No products yet</p>
                    ) : (
                      categoryProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="glass rounded-xl p-4 hover:bg-white/5 transition-all relative group/item"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-semibold tracking-tight text-white truncate">
                                  {product.brand}
                                </h3>
                                {product.conflicts && product.conflicts.length > 0 && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="relative"
                                  >
                                    <AlertTriangle size={14} strokeWidth={1} className="text-orange-400" />
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-orange-400/20 text-orange-300 text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none">
                                      {product.conflicts[0].reason}
                                    </span>
                                  </motion.div>
                                )}
                              </div>
                              <p className="text-xs text-white/60 font-light mb-2">{product.name}</p>
                              {product.expiryDate && (
                                <div className="flex items-center gap-1.5 text-xs text-white/40">
                                  <Calendar size={12} strokeWidth={1} />
                                  <span>Expires: {new Date(product.expiryDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded"
                            >
                              <X size={14} strokeWidth={1} className="text-white/60 hover:text-white transition-colors" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tighter text-white">Add Product</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} strokeWidth={1} className="text-white/60" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-tight">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:border-purple-400/50 focus:outline-none transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-black text-white">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-tight">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:border-purple-400/50 focus:outline-none transition-colors placeholder-white/30"
                    placeholder="e.g., La Roche-Posay"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-tight">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:border-purple-400/50 focus:outline-none transition-colors placeholder-white/30"
                    placeholder="e.g., Toleriane Double Repair Face Moisturizer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-tight">
                    Key Ingredients <span className="text-white/40 font-normal">(optional, for conflict checking)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:border-purple-400/50 focus:outline-none transition-colors placeholder-white/30"
                    placeholder="e.g., Alcohol Denat, Fragrance, Retinol"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-tight">
                    Expiry Date <span className="text-white/40 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:border-purple-400/50 focus:outline-none transition-colors"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={!saving ? { scale: 1.02 } : {}}
                  whileTap={!saving ? { scale: 0.98 } : {}}
                  className={`w-full glass rounded-full px-6 py-3 text-sm font-medium tracking-tight flex items-center justify-center gap-2 hover:bg-white/10 transition-colors ${
                    saving ? 'opacity-50 cursor-not-allowed' : 'animate-breathe'
                  }`}
                >
                  {saving ? (
                    <>
                      <Loader size={18} strokeWidth={1} className="animate-spin text-purple-400" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} strokeWidth={1} />
                      <span>Add to Vanity</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VanityPage