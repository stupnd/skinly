import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { analyzeSkin } from './routes/analyzeSkin.js'

const app = express()
const PORT = process.env.PORT || 3001

// Check for OpenAI API key on startup
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY not found in environment variables.')
  console.warn('   Please create a .env file in the project root with:')
  console.warn('   OPENAI_API_KEY=your_openai_api_key_here')
  console.warn('   The server will start, but skin analysis will not work without an API key.\n')
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://skinly-vmmj.vercel.app',
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      process.env.FRONTEND_URL,
    ].filter(Boolean)
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true)
    }
    
    // In production, only allow specified origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.post('/api/analyze-skin', analyzeSkin)

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
  if (process.env.OPENAI_API_KEY) {
    console.log('✓ OpenAI API key configured\n')
  }
})
