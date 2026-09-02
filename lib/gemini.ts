import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

// Prioritized list of active Gemini models
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
]

/**
 * Ultra-fast helper to generate text with Google Gemini API
 * Includes 7s timeout per attempt so it never hangs indefinitely
 */
export async function generateGeminiContent(prompt: string): Promise<string> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi di file .env.local')
  }

  let lastErrorMessage = ''

  // 1. Direct REST generateContent with strict timeout (fastest & lowest latency)
  for (const model of GEMINI_MODELS) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 7000) // 7 seconds timeout

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
          signal: controller.signal,
        }
      )

      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          return text.trim()
        }
      } else {
        const errJson = await res.json().catch(() => null)
        const errMsg = errJson?.error?.message || `HTTP ${res.status}`
        lastErrorMessage = errMsg
        console.warn(`[Gemini API] Model ${model} failed (${res.status}): ${errMsg}`)
      }
    } catch (err: any) {
      lastErrorMessage = err.message || String(err)
      console.warn(`[Gemini API] Error/timeout with model ${model}:`, lastErrorMessage)
    }
  }

  // 2. Fallback to SDK with gemini-1.5-flash
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const sdkText = result.response.text()
    if (sdkText) {
      return sdkText.trim()
    }
  } catch (sdkErr: any) {
    console.error('[Gemini SDK fallback error]:', sdkErr.message || sdkErr)
  }

  throw new Error(`Gagal menghasilkan respon AI (${lastErrorMessage || 'Timeout'}). Silakan coba klik sekali lagi.`)
}
