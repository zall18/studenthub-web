import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateGeminiContent } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { taskId, taskTitle } = await req.json()
    if (!taskId || !taskTitle) {
      return NextResponse.json({ error: 'Task ID and Title are required' }, { status: 400 })
    }

    const prompt = `
      Anda adalah asisten AI produktivitas.
      Tugas Anda adalah memecah tugas besar berikut menjadi langkah-langkah kerja yang kecil (maksimal 5 langkah), spesifik, dan siap dieksekusi agar pengguna tidak kelelahan (burnout).
      
      Tugas utama: "${taskTitle}"
      
      Output HANYA dalam bentuk array string (JSON) yang berisi langkah-langkahnya.
      Contoh Output:
      [
        "Riset 3 referensi desain sejenis",
        "Buat wireframe kasar di kertas",
        "Pindahkan ke Figma"
      ]
    `

    const responseText = await generateGeminiContent(prompt)
    
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim()
    const parsedSubtasks: string[] = JSON.parse(cleanedText)

    return NextResponse.json({
      success: true,
      subtasks: parsedSubtasks
    })
  } catch (error) {
    console.error('Error in AI task breaker:', error)
    return NextResponse.json({ error: 'Failed to break task' }, { status: 500 })
  }
}
