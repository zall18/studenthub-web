import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// List of supported Gemini models in fallback order
const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
]

/**
 * Robust helper to generate text using Gemini with automatic model fallback.
 */
export async function generateGeminiContent(prompt: string): Promise<string> {
  let lastError: any = null

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      if (text) {
        return text
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Failed with model "${modelName}":`, err.message || err)
      lastError = err
    }
  }

  throw lastError || new Error('Semua model Gemini tidak dapat diakses. Periksa GEMINI_API_KEY Anda.')
}
