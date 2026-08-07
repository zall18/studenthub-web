import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { input } = await req.json()
    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `
      Anda adalah asisten AI produktivitas.
      Tugas Anda adalah mengkategorikan input dari pengguna ke dalam salah satu dari 3 pilar: 'MATKUL', 'ORGANISASI', atau 'PROYEK'.
      
      Input pengguna: "${input}"
      
      Output HANYA dalam bentuk JSON dengan format berikut:
      {
        "type": "MATKUL" | "ORGANISASI" | "PROYEK",
        "title": "Judul tugas yang disarikan dari input (singkat & jelas)"
      }
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Clean up potential markdown formatting in response (e.g., ```json ... ```)
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim()
    const parsedData = JSON.parse(cleanedText)

    // TODO: Insert into Supabase 'tasks' table using the appropriate pillar_id
    // Note: In a real app, we would look up the pillar_id based on user_id and parsedData.type

    return NextResponse.json({
      success: true,
      data: parsedData
    })
  } catch (error) {
    console.error('Error in AI categorizer:', error)
    return NextResponse.json({ error: 'Failed to process input' }, { status: 500 })
  }
}
