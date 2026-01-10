import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, X, Loader, ArrowRight } from 'lucide-react'

const UploadPage = () => {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFileSelect = (file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      setImage(file)
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleRemoveImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setImage(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAnalyze = async () => {
    if (!image) return
    
    setIsProcessing(true)
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      navigate('/results')
    }, 2000)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto w-full space-y-12"
      >
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
            <span className="text-gradient">Upload Your Image</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/50 font-light leading-relaxed"
          >
            Capture your skin with precision. JPG and PNG supported.
          </motion.p>
        </motion.div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Drop Zone / Preview Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 100 }}
          className="relative group"
        >
          {!preview ? (
            <motion.div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`glass rounded-3xl p-16 md:p-24 border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-purple-400/60 bg-purple-500/10 shadow-[0_0_40px_rgba(192,132,252,0.4),0_0_80px_rgba(192,132,252,0.2)]'
                  : 'border-white/20 hover:border-white/30'
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-6">
                <motion.div
                  animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <UploadIcon 
                    size={80} 
                    strokeWidth={1} 
                    className={`transition-colors duration-300 ${
                      isDragging ? 'text-purple-400' : 'text-purple-400/60'
                    }`}
                  />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-medium tracking-tight text-white/90">
                    {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-sm text-white/40 font-light">
                    JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative glass rounded-3xl p-8 overflow-hidden group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Remove Button - appears on hover */}
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-4 right-4 glass rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/10"
                >
                  <X size={20} strokeWidth={1} className="text-white/80 hover:text-white transition-colors" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Analyze Button */}
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <motion.button
                onClick={handleAnalyze}
                disabled={isProcessing}
                whileHover={!isProcessing ? { scale: 1.02 } : {}}
                whileTap={!isProcessing ? { scale: 0.98 } : {}}
                className={`glass rounded-full px-10 py-4 text-base font-medium tracking-tight flex items-center gap-3 transition-all ${
                  isProcessing
                    ? 'opacity-75 cursor-not-allowed'
                    : 'hover:bg-white/10 animate-breathe cursor-pointer'
                }`}
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Loader 
                        size={20} 
                        strokeWidth={1} 
                        className="text-purple-400" 
                      />
                    </motion.div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze My Skin</span>
                    <ArrowRight 
                      size={18} 
                      strokeWidth={1} 
                      className="transition-transform group-hover:translate-x-1" 
                    />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default UploadPage