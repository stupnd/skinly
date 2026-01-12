import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  CheckCircle2, 
  Leaf,
  Flower2,
  Filter,
  X,
  Star
} from 'lucide-react'

// Tone to Foundation Shade Mapping
const toneToFoundations = {
  'Fair Cool': [
    { brand: 'Fenty Beauty', shade: '110', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Siberia', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '100W', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Glossier', shade: 'G1', name: 'Perfecting Skin Tint', price: '$26' },
  ],
  'Fair Warm': [
    { brand: 'Fenty Beauty', shade: '130', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Gobi', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '120W', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Glossier', shade: 'G2', name: 'Perfecting Skin Tint', price: '$26' },
  ],
  'Fair Neutral': [
    { brand: 'Fenty Beauty', shade: '120', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Mont Blanc', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '110N', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Glossier', shade: 'G3', name: 'Perfecting Skin Tint', price: '$26' },
  ],
  'Light Cool': [
    { brand: 'Fenty Beauty', shade: '180', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Deauville', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '140C', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '2 Fair', name: 'Magic Foundation', price: '$44' },
  ],
  'Light Warm': [
    { brand: 'Fenty Beauty', shade: '190', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Santa Fe', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '150W', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '3 Fair', name: 'Magic Foundation', price: '$44' },
  ],
  'Light Neutral': [
    { brand: 'Fenty Beauty', shade: '185', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Ceylan', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '145N', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '3.5 Fair', name: 'Magic Foundation', price: '$44' },
  ],
  'Medium Cool': [
    { brand: 'Fenty Beauty', shade: '240', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Barcelona', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '200C', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '5 Medium', name: 'Magic Foundation', price: '$44' },
  ],
  'Medium Warm': [
    { brand: 'Fenty Beauty', shade: '250', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Stromboli', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '210W', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '6 Medium', name: 'Magic Foundation', price: '$44' },
  ],
  'Medium Neutral': [
    { brand: 'Fenty Beauty', shade: '245', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Macao', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '205N', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '6.5 Medium', name: 'Magic Foundation', price: '$44' },
  ],
  'Tan Cool': [
    { brand: 'Fenty Beauty', shade: '330', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Tahoe', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '260C', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '8 Medium-Dark', name: 'Magic Foundation', price: '$44' },
  ],
  'Tan Warm': [
    { brand: 'Fenty Beauty', shade: '340', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Aruba', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '270W', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '9 Medium-Dark', name: 'Magic Foundation', price: '$44' },
  ],
  'Tan Neutral': [
    { brand: 'Fenty Beauty', shade: '335', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Cadiz', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '265N', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '9.5 Medium-Dark', name: 'Magic Foundation', price: '$44' },
  ],
  'Deep Cool': [
    { brand: 'Fenty Beauty', shade: '430', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Benares', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '340C', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '11 Deep', name: 'Magic Foundation', price: '$44' },
  ],
  'Deep Warm': [
    { brand: 'Fenty Beauty', shade: '440', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Zambezi', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '350W', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '12 Deep', name: 'Magic Foundation', price: '$44' },
  ],
  'Deep Neutral': [
    { brand: 'Fenty Beauty', shade: '435', name: 'Pro Filt\'r Soft Matte Longwear Foundation', price: '$38' },
    { brand: 'NARS', shade: 'Cacao', name: 'Natural Radiant Longwear Foundation', price: '$50' },
    { brand: 'Rare Beauty', shade: '345N', name: 'Liquid Touch Weightless Foundation', price: '$29' },
    { brand: 'Charlotte Tilbury', shade: '12.5 Deep', name: 'Magic Foundation', price: '$44' },
  ],
}

// Product attributes for filtering
const productAttributes = {
  'Fenty Beauty': { crueltyFree: true, vegan: true, fragranceFree: true },
  'NARS': { crueltyFree: false, vegan: false, fragranceFree: true },
  'Rare Beauty': { crueltyFree: true, vegan: true, fragranceFree: true },
  'Glossier': { crueltyFree: true, vegan: false, fragranceFree: false },
  'Charlotte Tilbury': { crueltyFree: false, vegan: false, fragranceFree: false },
}

// Generate match score based on tone compatibility
const calculateMatchScore = (userTone, productTone) => {
  const userShade = userTone.split(' ')[0]
  const userUndertone = userTone.split(' ')[1]
  const productShade = productTone.split(' ')[0]
  const productUndertone = productTone.split(' ')[1]

  let score = 70 // Base score

  // Shade match (exact = +20, similar = +10)
  if (userShade === productShade) {
    score += 20
  } else if (areShadesSimilar(userShade, productShade)) {
    score += 10
  }

  // Undertone match (exact = +10, neutral works with all = +5)
  if (userUndertone === productUndertone) {
    score += 10
  } else if (productUndertone === 'Neutral') {
    score += 5
  } else if (userUndertone === 'Neutral') {
    score += 5
  }

  return Math.min(99, score) // Cap at 99%
}

const areShadesSimilar = (shade1, shade2) => {
  const shadeOrder = ['Fair', 'Light', 'Medium', 'Tan', 'Deep']
  const idx1 = shadeOrder.indexOf(shade1)
  const idx2 = shadeOrder.indexOf(shade2)
  return Math.abs(idx1 - idx2) === 1
}

// Generate "Why it fits" explanation
const generateWhyItFits = (userTone, userConcerns, productBrand, matchScore) => {
  const userShade = userTone.split(' ')[0]?.toLowerCase() || ''
  const userUndertone = userTone.split(' ')[1]?.toLowerCase() || ''
  const concerns = userConcerns || []
  
  // Primary explanation based on undertone + concern combination
  if (concerns.some(c => c.toLowerCase().includes('redness'))) {
    if (userUndertone === 'warm') {
      return `The warm undertones in this foundation balance your slight redness while complementing your golden complexion.`
    } else if (userUndertone === 'cool') {
      return `The cool undertones help neutralize redness while enhancing your natural pink tones.`
    }
    return `This formula helps neutralize redness for a more even complexion.`
  }
  
  if (concerns.some(c => c.toLowerCase().includes('dryness'))) {
    return `The hydrating formula addresses your dryness concerns while matching your ${userShade} ${userUndertone} tone.`
  }
  
  if (concerns.some(c => c.toLowerCase().includes('oil'))) {
    return `The matte finish controls shine throughout the day, perfect for your ${userShade} skin tone.`
  }

  // Undertone-based explanations
  if (userUndertone === 'warm') {
    return `The warm undertones complement your golden complexion for a natural, seamless blend.`
  } else if (userUndertone === 'cool') {
    return `The cool undertones enhance your natural pink tones for a perfect match.`
  } else if (userUndertone === 'neutral') {
    return `The balanced undertones work harmoniously with your versatile skin tone.`
  }

  // Match score based fallback
  if (matchScore >= 95) {
    return `Near-perfect match with your ${userShade} ${userUndertone} skin tone.`
  } else if (matchScore >= 85) {
    return `Excellent match that will blend seamlessly with your complexion.`
  }

  return `This shade is well-suited for your skin tone profile.`
}

const Stage5Products = () => {
  const [skinAnalysis, setSkinAnalysis] = useState(null)
  const [tone, setTone] = useState(null)
  const [concerns, setConcerns] = useState([])
  const [filters, setFilters] = useState({
    crueltyFree: false,
    vegan: false,
    fragranceFree: false,
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Load analysis from localStorage
    const savedAnalysis = localStorage.getItem('skinAnalysis')
    if (savedAnalysis) {
      const analysis = JSON.parse(savedAnalysis)
      setSkinAnalysis(analysis)
      
      if (analysis.tone) {
        const toneKey = `${analysis.tone.shade} ${analysis.tone.undertone}`
        setTone(toneKey)
      }
      
      if (analysis.concerns) {
        setConcerns(analysis.concerns)
      }
    }
  }, [])

  // Get matched products based on tone
  const matchedProducts = useMemo(() => {
    if (!tone || !toneToFoundations[tone]) return []

    return toneToFoundations[tone].map((product, index) => {
      // Calculate match score (products in the mapping are already matched, so high scores)
      // Add slight variations for more realistic scores
      const baseScore = 92 + (index % 7) // Scores between 92-99%
      const matchScore = Math.min(99, baseScore)
      const whyItFits = generateWhyItFits(tone, concerns, product.brand, matchScore)
      const attributes = productAttributes[product.brand] || {}

      return {
        ...product,
        matchScore,
        whyItFits,
        ...attributes,
        tone: tone, // Store the matched tone for reference
      }
    })
  }, [tone, concerns])

  // Filter products
  const filteredProducts = useMemo(() => {
    return matchedProducts.filter(product => {
      if (filters.crueltyFree && !product.crueltyFree) return false
      if (filters.vegan && !product.vegan) return false
      if (filters.fragranceFree && !product.fragranceFree) return false
      return true
    })
  }, [matchedProducts, filters])

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  if (!skinAnalysis || !tone) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-lg text-white/50 font-light">
            Please complete a skin analysis first to see personalized foundation matches.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto w-full space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
                <span className="text-gradient">Shade Matcher</span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed">
                Foundation matches for <span className="text-white/80 font-medium">{tone}</span> skin
              </p>
            </div>

            {/* Filter Toggle */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass rounded-full px-6 py-3 text-sm font-medium tracking-tight flex items-center gap-2 hover:bg-white/10 transition-colors relative"
            >
              <Filter size={18} strokeWidth={1} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-400 text-black text-xs font-bold flex items-center justify-center"
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    onClick={() => toggleFilter('crueltyFree')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`glass rounded-full px-4 py-2 text-xs font-medium tracking-tight flex items-center gap-2 transition-colors ${
                      filters.crueltyFree 
                        ? 'bg-purple-400/20 border border-purple-400/50 text-purple-300' 
                        : 'hover:bg-white/10 text-white/60'
                    }`}
                  >
                    <CheckCircle2 size={14} strokeWidth={1} />
                    <span>Cruelty-Free</span>
                  </motion.button>

                  <motion.button
                    onClick={() => toggleFilter('vegan')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`glass rounded-full px-4 py-2 text-xs font-medium tracking-tight flex items-center gap-2 transition-colors ${
                      filters.vegan 
                        ? 'bg-green-400/20 border border-green-400/50 text-green-300' 
                        : 'hover:bg-white/10 text-white/60'
                    }`}
                  >
                    <Leaf size={14} strokeWidth={1} />
                    <span>Vegan</span>
                  </motion.button>

                  <motion.button
                    onClick={() => toggleFilter('fragranceFree')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`glass rounded-full px-4 py-2 text-xs font-medium tracking-tight flex items-center gap-2 transition-colors ${
                      filters.fragranceFree 
                        ? 'bg-blue-400/20 border border-blue-400/50 text-blue-300' 
                        : 'hover:bg-white/10 text-white/60'
                    }`}
                  >
                    <Flower2 size={14} strokeWidth={1} />
                    <span>Fragrance-Free</span>
                  </motion.button>

                  {activeFiltersCount > 0 && (
                    <motion.button
                      onClick={() => setFilters({ crueltyFree: false, vegan: false, fragranceFree: false })}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass rounded-full px-4 py-2 text-xs font-medium tracking-tight flex items-center gap-2 hover:bg-white/10 transition-colors text-white/60"
                    >
                      <X size={14} strokeWidth={1} />
                      <span>Clear All</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="md:col-span-full glass rounded-2xl p-12 text-center"
            >
              <p className="text-white/50 font-light">No products match your current filters.</p>
            </motion.div>
          ) : (
            filteredProducts.map((product, index) => (
              <motion.div
                key={`${product.brand}-${product.shade}-${index}`}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-2xl p-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Match Score Badge */}
                <div className="relative z-10 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      className="flex items-center gap-2 glass rounded-full px-3 py-1.5"
                    >
                      <Star size={14} strokeWidth={1} className="text-yellow-400" fill="currentColor" />
                      <span className="text-sm font-bold tracking-tight text-white">
                        {product.matchScore}% Match
                      </span>
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-white mb-1">
                        {product.brand}
                      </h3>
                      <p className="text-sm text-purple-400 font-medium mb-2">
                        Shade {product.shade}
                      </p>
                    </div>

                    <p className="text-xs text-white/70 font-light leading-relaxed mb-3">
                      {product.name}
                    </p>

                    {/* Why it fits */}
                    <div className="glass rounded-xl p-3 bg-purple-500/10 border border-purple-400/20">
                      <p className="text-xs text-purple-300 font-light leading-relaxed italic">
                        "{product.whyItFits}"
                      </p>
                    </div>

                    {/* Attributes */}
                    <div className="flex items-center gap-2 pt-2">
                      {product.crueltyFree && (
                        <div className="flex items-center gap-1 text-xs text-white/40">
                          <CheckCircle2 size={12} strokeWidth={1} className="text-green-400" />
                          <span>CF</span>
                        </div>
                      )}
                      {product.vegan && (
                        <div className="flex items-center gap-1 text-xs text-white/40">
                          <Leaf size={12} strokeWidth={1} className="text-green-400" />
                          <span>Vegan</span>
                        </div>
                      )}
                      {product.fragranceFree && (
                        <div className="flex items-center gap-1 text-xs text-white/40">
                          <Flower2 size={12} strokeWidth={1} className="text-blue-400" />
                          <span>FF</span>
                        </div>
                      )}
                    </div>

                    <p className="text-lg font-semibold tracking-tight text-white pt-2">
                      {product.price}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Stage5Products