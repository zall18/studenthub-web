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

    const { 
      prompt, 
      context, 
      format = 'whatsapp',
      targetAudience = 'dosen',
      customTarget,
      tone = 'formal',
      senderName,
      senderRole,
      senderOrgOrNim 
    } = await req.json()
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Determine target recipient context
    let targetDescription = 'Dosen / Tenaga Pengajar / Birokrasi Akademik Kampus'
    if (targetAudience === 'perusahaan') {
      targetDescription = 'Perusahaan / Calon Sponsor / Mitra Bisnis / Vendor'
    } else if (targetAudience === 'organisasi') {
      targetDescription = 'Anggota Organisasi / Rekan Satu Tim / Panitia Acara'
    } else if (targetAudience === 'masyarakat') {
      targetDescription = 'Tokoh Masyarakat / Warga / Pihak Eksternal Luar Kampus'
    } else if (targetAudience === 'klien') {
      targetDescription = 'Klien / Pemilik Proyek / Mitra Kolaborasi'
    } else if (targetAudience === 'custom' && customTarget) {
      targetDescription = customTarget
    }

    // Format specific instructions
    const formatInstructions = format === 'email' 
      ? `Format output sebagai EMAIL formal dengan:
         - Subject line yang jelas, menarik, dan profesional (misal: "Subject: [Perihal]")
         - Salam pembuka resmi yang sesuai dengan penerima (Yth. Bapak/Ibu [Nama/Jabatan] / Yang Terhormat)
         - Paragraf pembuka berisi identitas dan perkenalan singkat
         - Paragraf inti yang jelas, terstruktur (gunakan bullet points jika perlu), dan to the point
         - Paragraf penutup dengan ucapan terima kasih dan call-to-action yang sopan
         - Salam penutup formal (Hormat kami, / Dengan hormat, / Salam hangat,)`
      : `Format output sebagai pesan WHATSAPP terstruktur dengan:
         - Salam pembuka yang sopan dan ramah (misal: "Selamat pagi/siang Bapak/Ibu/Rekan-rekan" atau "Assalamualaikum Wr. Wb.")
         - Identitas singkat pengirim
         - Poin inti pesan yang ringkas, mudah dibaca cepat di layar ponsel (bisa gunakan format bold *teks* atau emoji formal seperlunya)
         - Penutup yang sopan dan apresiatif`

    // Tone instructions
    let toneInstruction = 'Gunakan bahasa Indonesia baku, sangat sopan, hormat, dan menjunjung tinggi etika akademik.'
    if (tone === 'persuasif') {
      toneInstruction = 'Gunakan bahasa profesional, persuasif, mengedepankan nilai tambah (value proposition), percaya diri namun tetap rendah hati dan menghargai.'
    } else if (tone === 'hangat') {
      toneInstruction = 'Gunakan bahasa yang hangat, memotivasi, kolaboratif, namun tetap rapi, terstruktur, dan jelas.'
    }

    // Identity injection
    const identityParts = []
    if (senderName) identityParts.push(`Nama: ${senderName}`)
    if (senderRole) identityParts.push(`Peran/Jabatan: ${senderRole}`)
    if (senderOrgOrNim) identityParts.push(`NIM/Instansi/Organisasi: ${senderOrgOrNim}`)

    const identitySection = identityParts.length > 0
      ? `Identitas pengirim yang HARUS dimasukkan secara natural dalam pesan:\n${identityParts.map(p => `- ${p}`).join('\n')}`
      : 'Identitas pengirim tidak spesifik, buat placeholder yang wajar seperti [Nama Pengirim], [Jabatan/NIM].'

    const systemPrompt = `
      Anda adalah AI asisten komunikasi profesional serbaguna untuk mahasiswa dan pengurus organisasi.
      
      Tugas Utama:
      1. Menerima draf/ide pesan informal atau poin-poin singkat dari pengguna
      2. Mengubahnya menjadi pesan yang terstruktur rapi, siap kirim, dan sangat sesuai dengan target penerima serta saluran komunikasi yang dipilih
      3. Menjaga esensi maksud asli pesan tanpa menambahkan klaim palsu yang tidak ada di input
      
      Target Penerima: ${targetDescription}
      Saluran Komunikasi: ${format.toUpperCase()}
      Gaya Bahasa (Tone): ${toneInstruction}
      
      ${formatInstructions}
      
      ${identitySection}
      
      ${context ? `Konteks Tugas/Proyek Terkait:\n"${context}"` : ''}
      
      Input Pengguna (Pesan Asli):
      "${prompt}"
      
      Aturan Output:
      - Berikan HANYA teks pesan akhir yang siap di-copy-paste
      - Jangan tambahkan catatan kaki atau penjelasan basa-basi di luar pesan
    `

    let draft = ''
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent(systemPrompt)
      draft = result.response.text()
    } catch (modelErr) {
      console.warn('Fallback to gemini-2.0-flash or gemini-2.5-flash', modelErr)
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const result = await fallbackModel.generateContent(systemPrompt)
      draft = result.response.text()
    }

    return NextResponse.json({
      success: true,
      draft: draft.trim(),
      format,
      targetAudience
    })
  } catch (error: any) {
    console.error('Error in AI draft message:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to draft message' 
    }, { status: 500 })
  }
}
