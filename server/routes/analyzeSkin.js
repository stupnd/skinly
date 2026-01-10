import OpenAI from 'openai'

// Lazy initialization of OpenAI client
let openai = null

const getOpenAIClient = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.')
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
}

export const analyzeSkin = async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({ error: 'No image provided' })
    }

    // Initialize OpenAI client (will throw if API key not configured)
    const client = getOpenAIClient()

    // Extract base64 data if it includes data URL prefix
    const base64Image = image.includes('data:image') 
      ? image.split(',')[1] 
      : image

    const prompt = `Analyze this skin image and provide a detailed assessment. Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.

Return a JSON object with this exact structure:
{
  "skinType": "Oily" | "Dry" | "Combination" | "Normal",
  "tone": {
    "shade": "Fair" | "Light" | "Medium" | "Tan" | "Deep",
    "undertone": "Cool" | "Warm" | "Neutral"
  },
  "concerns": ["specific concern 1", "specific concern 2", ...],
  "routine": {
    "am": ["product category 1", "product category 2", ...],
    "pm": ["product category 1", "product category 2", ...]
  }
}

Guidelines:
- Skin Type: Assess oil production, dryness, and combination patterns
- Tone Shade: Evaluate overall skin color depth (Fair to Deep)
- Undertone: Determine if skin has cool (pink/blue), warm (yellow/peach), or neutral undertones
- Concerns: List specific, observable issues like "redness around nose", "dark circles under eyes", "texture irregularities on cheeks", "hyperpigmentation on forehead", etc. Be specific and descriptive.
- Routine: Suggest product categories (not specific brands) like "Gentle Cleanser", "Hydrating Serum", "SPF 30+ Sunscreen", "Retinol Treatment", "Moisturizer", etc.

Important: This analysis is for informational purposes only and is not a substitute for professional medical or dermatological advice. Always consult with a healthcare professional for skin concerns.`

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" }
    })

    const analysis = JSON.parse(response.choices[0].message.content)

    // Add disclaimer
    const result = {
      ...analysis,
      disclaimer: "This analysis is for informational purposes only and is not a substitute for professional medical or dermatological advice. Always consult with a healthcare professional for skin concerns."
    }

    res.json(result)
  } catch (error) {
    console.error('Error analyzing skin:', error)
    res.status(500).json({ 
      error: 'Failed to analyze skin image',
      details: error.message 
    })
  }
}
