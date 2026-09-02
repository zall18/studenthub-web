import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

// Prioritized list of modern Gemini models
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-2.5-flash',
]

/**
 * Robust helper to generate text with Google Gemini API
 * Supports gemini-3.8-flash and automatic fallback across modern models
 */
export async function generateGeminiContent(prompt: string): Promise<string> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi di file .env.local')
  }

  let lastError: any = null

  // 1. Try modern Interactions REST endpoint first for Gemini 3.8/3.7/3.6
  for (const modelName of GEMINI_MODELS) {
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          model: modelName,
          input: prompt,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const outputText = data.output_text || data.outputs?.[0]?.text || data.candidates?.[0]?.content?.parts?.[0]?.text
        if (outputText) {
          return outputText
        }
      }
    } catch (err) {
      // Continue to next attempt
    }
  }

  // 2. Try standard generateContent with SDK & REST
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      if (text) {
        return text
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Failed generateContent with "${modelName}":`, err.message || err)
      lastError = err
    }
  }

  throw lastError || new Error('Tidak dapat menghasilkan respon dari Gemini AI. Periksa koneksi atau GEMINI_API_KEY.')
}
