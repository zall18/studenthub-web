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

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch completed tasks this week
    const { data: completedTasks } = await supabase
      .from('tasks')
      .select('title, pillars(name, type)')
      .eq('user_id', user.id)
      .eq('status', 'DONE')
      .gte('updated_at', sevenDaysAgo)

    // Fetch pomodoro stats
    const { data: pomodoroLogs } = await supabase
      .from('pomodoro_logs')
      .select('duration, xp_earned, completed')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo)

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, level, focus_minutes, pet_type')
      .eq('id', user.id)
      .single()

    // Fetch redeemed rewards this week
    const { data: redeemed } = await supabase
      .from('custom_rewards')
      .select('title, cost')
      .eq('user_id', user.id)
      .eq('is_redeemed', true)
      .gte('redeemed_at', sevenDaysAgo)

    // Calculate stats
    const tasksCompleted = completedTasks?.length || 0
    const taskTitles = (completedTasks as any[])?.map(t => t.title) || []
    const focusSessions = (pomodoroLogs as any[])?.filter(l => l.completed).length || 0
    const focusMinutes = (pomodoroLogs as any[])?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0
    const xpFromPomodoro = (pomodoroLogs as any[])?.reduce((sum, l) => sum + (l.xp_earned || 0), 0) || 0
    const rewardsRedeemed = redeemed?.length || 0
    const totalXp = (profile as any)?.xp || 0
    const currentLevel = (profile as any)?.level || 1

    // If no activity, return minimal response
    if (tasksCompleted === 0 && focusSessions === 0) {
      return NextResponse.json({
        success: true,
        hasActivity: false,
        narrative: 'Minggu yang tenang. Tidak ada tugas yang diselesaikan minggu ini, tapi tidak apa-apa! Istirahat juga penting. Minggu depan, kita mulai lagi! 💪',
        stats: { tasksCompleted: 0, focusMinutes: 0, focusSessions: 0, xpGained: 0, rewardsRedeemed: 0, currentLevel }
      })
    }

    // Generate AI narrative
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const prompt = `
      Anda adalah asisten AI motivasi untuk mahasiswa Indonesia.
      
      Berdasarkan data aktivitas minggu ini, buatkan narasi afirmasi positif yang hangat, personal, dan memotivasi.
      Gunakan bahasa Indonesia santai tapi tetap sopan. Sertakan emoji yang relevan.
      
      Data Aktivitas Minggu Ini:
      - Tugas selesai: ${tasksCompleted} tugas
      - Judul tugas: ${taskTitles.slice(0, 8).join(', ')}
      - Sesi Pomodoro selesai: ${focusSessions} sesi
      - Total waktu fokus: ${focusMinutes} menit
      - XP dari Pomodoro: ${xpFromPomodoro} XP
      - Reward yang ditukar: ${rewardsRedeemed}
      - Level saat ini: Level ${currentLevel}
      - Total XP: ${totalXp}
      
      Panduan:
      - Maksimal 3 kalimat
      - Sebutkan beberapa judul tugas spesifik yang diselesaikan (buat terasa personal)
      - Akhiri dengan pesan motivasi untuk istirahat atau semangat minggu depan
      - Jangan terlalu formal, bayangkan seperti teman yang bangga dengan pencapaian mereka
      
      Output HANYA narasi, tanpa format atau label tambahan.
    `

    const result = await model.generateContent(prompt)
    const narrative = result.response.text().trim()

    return NextResponse.json({
      success: true,
      hasActivity: true,
      narrative,
      stats: {
        tasksCompleted,
        focusMinutes,
        focusSessions,
        xpGained: xpFromPomodoro + (tasksCompleted * 25), // 25 XP per task
        rewardsRedeemed,
        currentLevel
      }
    })
  } catch (error) {
    console.error('Error in Weekly Wrapped:', error)
    return NextResponse.json({ error: 'Failed to generate weekly wrapped' }, { status: 500 })
  }
}
