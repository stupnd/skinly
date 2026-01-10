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

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.post('/api/analyze-skin', analyzeSkin)

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
  if (process.env.OPENAI_API_KEY) {
    console.log('✓ OpenAI API key configured\n')
  }
})
