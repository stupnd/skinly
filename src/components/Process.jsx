import { motion } from 'framer-motion'
import { Upload, Sparkles, TrendingUp } from 'lucide-react'

const Process = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Capture your skin with precision. Our AI analyzes high-resolution images to map every detail.",
      gradient: "from-pink-500/20 to-purple-500/20",
    },
    {
      icon: Sparkles,
      title: "Analyze",
      description: "Advanced vision models identify concerns, texture, tone, and hydration levels in real-time.",
      gradient: "from-purple-500/20 to-indigo-500/20",
    },
    {
      icon: TrendingUp,
      title: "Track",
      description: "Monitor your skin's evolution over time with detailed analytics and personalized insights.",
      gradient: "from-indigo-500/20 to-pink-500/20",
    },
  ]

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

  return (
    <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          How It Works
        </h2>
        <p className="text-white/50 text-lg font-light max-w-2xl mx-auto">
          Three steps to transform your skincare routine
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-12 gap-4"
      >
        {steps.map((step, index) => {
          const Icon = step.icon
          let colClasses = ''
          
          if (index === 0) {
            // First card: 4 columns, starts at 1
            colClasses = 'md:col-span-4 md:col-start-1'
          } else if (index === 1) {
            // Second card (center): 5 columns, starts at 5 - wider for emphasis
            colClasses = 'md:col-span-5 md:col-start-5'
          } else {
            // Third card: 3 columns, starts at 10
            colClasses = 'md:col-span-3 md:col-start-10'
          }
          
          const isWide = index === 1
          
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`glass rounded-2xl ${isWide ? 'p-8 md:p-12' : 'p-8'} relative overflow-hidden group ${colClasses}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className={`mb-6 inline-flex`}>
                  <Icon 
                    size={isWide ? 40 : 32} 
                    strokeWidth={1} 
                    className="text-purple-400"
                  />
                </div>
                <h3 className={`font-semibold tracking-tight mb-3 ${isWide ? 'text-3xl mb-4' : 'text-2xl'}`}>
                  {step.title}
                </h3>
                <p className={`text-white/60 font-light leading-relaxed ${isWide ? 'text-base' : 'text-sm'}`}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}

export default Process