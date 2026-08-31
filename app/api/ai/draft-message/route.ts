import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, context, format, userName, userNim, userKelas } = await req.json()
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const formatInstructions = format === 'email' 
      ? `Format output sebagai email formal dengan:
         - Subject line yang jelas
         - Salam pembuka formal (Yth. / Yang Terhormat)
         - Isi pesan yang terstruktur
         - Salam penutup formal (Hormat saya, / Dengan hormat,)`
      : `Format output sebagai pesan WhatsApp formal dengan:
         - Salam pembuka singkat (Assalamualaikum / Selamat pagi/siang/sore)
         - Identitas diri (jika diberikan)
         - Isi pesan yang sopan dan jelas
         - Salam penutup (Terima kasih atas perhatiannya)`

    const identitySection = (userName || userNim || userKelas) 
      ? `Identitas pengirim yang harus dimasukkan dalam pesan:
         ${userName ? `- Nama: ${userName}` : ''}
         ${userNim ? `- NIM: ${userNim}` : ''}
         ${userKelas ? `- Kelas: ${userKelas}` : ''}`
      : 'Identitas pengirim tidak diberikan, buat placeholder [Nama], [NIM], [Kelas].'

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const systemPrompt = `
      Anda adalah asisten penyusun pesan formal untuk mahasiswa Indonesia.
      
      Tugas Anda:
      1. Menerima input informal/kasar dari mahasiswa
      2. Mengubahnya menjadi pesan formal dengan bahasa Indonesia akademik yang SOPAN, PROFESIONAL, dan TERSTRUKTUR
      3. Menjaga esensi dan maksud asli dari input pengguna
      
      ${formatInstructions}
      
      ${identitySection}
      
      ${context ? `Konteks tugas terkait: "${context}"` : ''}
      
      Panduan gaya bahasa:
      - Gunakan bahasa Indonesia baku (EYD)
      - Hindari bahasa gaul, singkatan informal, atau emoji
      - Gunakan kalimat yang efektif dan tidak bertele-tele
      - Perhatikan tanda baca dan ejaan
      - Tambahkan kalimat penghubung yang sopan
      - Gunakan sapaan yang sesuai (Bapak/Ibu/Dr./Prof. sesuai konteks)
      
      Input pengguna: "${prompt}"
      
      Output HANYA pesan yang sudah diformat, tanpa penjelasan tambahan.
    `

    const result = await model.generateContent(systemPrompt)
    const draft = result.response.text()

    return NextResponse.json({
      success: true,
      draft: draft.trim(),
      format: format || 'whatsapp'
    })
  } catch (error) {
    console.error('Error in AI draft message:', error)
    return NextResponse.json({ error: 'Failed to draft message' }, { status: 500 })
  }
}
