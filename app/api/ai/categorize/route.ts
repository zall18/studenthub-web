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

    const { input } = await req.json()
    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    const currentDateTime = new Date().toLocaleString('id-ID', { 
      timeZone: 'Asia/Jakarta', 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const prompt = `
      Anda adalah asisten AI produktivitas.
      Tugas Anda adalah mengkategorikan input dari pengguna ke dalam salah satu dari 3 pilar: 'MATKUL', 'ORGANISASI', atau 'PROYEK'.
      
      Konteks Waktu Saat Ini (Gunakan ini sebagai acuan hari ini, besok, lusa, minggu depan, dsb):
      ${currentDateTime}
      
      Input pengguna: "${input}"
      
      Output HANYA dalam bentuk JSON dengan format berikut:
      {
        "requires_clarification": boolean (true jika input pengguna terlalu ambigu/tidak jelas judul tugasnya),
        "clarification_message": "Pesan balasan ramah jika requires_clarification true (misal: 'Tugas apa nih spesifiknya?', jika false isi null)",
        "type": "MATKUL" | "ORGANISASI" | "PROYEK" (pilih yang paling mendekati, atau null jika sangat tidak jelas),
        "title": "Judul tugas yang disarikan dari input (singkat & jelas, atau null jika butuh klarifikasi)",
        "description": "Deskripsi tugas yang disarikan dari input (bila ada, jika tidak isi null)",
        "category": "Kategori tugas (misal: 'Tugas', 'Kuis', 'UTS', 'UAS', 'Rapat', dll. Berikan yang paling relevan atau null)",
        "tags": ["tag1", "tag2"] (Array of string, maksimal 3 kata kunci penting dari input pengguna, jika tidak ada kembalikan array kosong []),
        "due_date": "Tanggal deadline (format ISO 8601 YYYY-MM-DDTHH:mm:ssZ, pastikan tahun, bulan, tanggal disesuaikan dengan Konteks Waktu Saat Ini. Bila ada di input, jika tidak isi null)"
      }
    `

    const responseText = await generateGeminiContent(prompt)
    
    // Clean up potential markdown formatting in response (e.g., ```json ... ```)
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim()
    const parsedData = JSON.parse(cleanedText)

    if (parsedData.requires_clarification) {
      return NextResponse.json({
        success: true,
        requires_clarification: true,
        message: parsedData.clarification_message,
        partial_data: parsedData
      })
    }

    // 1. Get or create a pillar for this type
    let pillarId = null
    const { data: existingPillars } = await (supabase
      .from('pillars') as any)
      .select('id')
      .eq('user_id', user.id)
      .eq('type', parsedData.type)
      .limit(1)

    if (existingPillars && existingPillars.length > 0) {
      pillarId = existingPillars[0].id
    } else {
      // Create a default pillar if none exists for this type
      const { data: newPillar } = await (supabase
        .from('pillars') as any)
        .insert({
          user_id: user.id,
          name: `Pilar ${parsedData.type}`,
          type: parsedData.type
        })
        .select()
        .single()
        
      if (newPillar) pillarId = newPillar.id
    }

    // 2. Insert the task
    const { data: newTask, error: taskError } = await (supabase
      .from('tasks') as any)
      .insert({
        user_id: user.id,
        pillar_id: pillarId,
        title: parsedData.title,
        description: parsedData.description || null,
        category: parsedData.category || null,
        due_date: parsedData.due_date || null,
        status: 'TO_DO',
        is_ai_generated: true
      })
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
