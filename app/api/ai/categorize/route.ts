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

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })
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

    // 1. Get or create a pillar for this type
    let pillarId = null
    const { data: existingPillars } = await supabase
      .from('pillars')
      .select('id')
      .eq('user_id', user.id)
      .eq('type', parsedData.type)
      .limit(1)

    if (existingPillars && existingPillars.length > 0) {
      pillarId = existingPillars[0].id
    } else {
      // Create a default pillar if none exists for this type
      const { data: newPillar, error: pillarError } = await supabase
        .from('pillars')
        .insert({
          user_id: user.id,
          name: `Pilar ${parsedData.type}`,
          type: parsedData.type
        } as any)
        .select()
        .single()
        
      if (newPillar) pillarId = (newPillar as any).id
    }

    // 2. Insert the task
    const { data: newTask, error: taskError } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        pillar_id: pillarId,
        title: parsedData.title,
        status: 'TO_DO',
        is_ai_generated: true
      } as any)
      .select()
      .single()

    if (taskError) throw taskError

    return NextResponse.json({
      success: true,
      data: {
        ...parsedData,
        task: newTask
      }
    })
  } catch (error) {
    console.error('Error in AI categorizer:', error)
    return NextResponse.json({ error: 'Failed to process input' }, { status: 500 })
  }
}
