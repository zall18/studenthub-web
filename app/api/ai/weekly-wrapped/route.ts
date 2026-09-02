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

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch completed tasks this week
    let completedTasks: any[] = []
    try {
      const { data } = await supabase
        .from('tasks')
        .select('title, pillars(name, type)')
        .eq('user_id', user.id)
        .eq('status', 'DONE')
        .gte('updated_at', sevenDaysAgo)
      completedTasks = data || []
    } catch (e) {
      console.warn('Could not fetch completed tasks for wrapped:', e)
    }

    // Fetch pomodoro stats
    let pomodoroLogs: any[] = []
    try {
      const { data } = await supabase
        .from('pomodoro_logs')
        .select('duration, xp_earned, completed')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo)
      pomodoroLogs = data || []
    } catch (e) {
      console.warn('Could not fetch pomodoro logs for wrapped:', e)
    }

    // Fetch profile
    let profile: any = null
    try {
      const { data } = await (supabase
        .from('profiles') as any)
        .select('xp, level, focus_minutes, pet_type')
        .eq('id', user.id)
        .maybeSingle()
      profile = data
    } catch (e) {
      console.warn('Could not fetch profile for wrapped:', e)
    }

    // Fetch redeemed rewards this week
    let redeemed: any[] = []
    try {
      const { data } = await (supabase
        .from('custom_rewards') as any)
        .select('title, cost')
        .eq('user_id', user.id)
        .eq('is_redeemed', true)
        .gte('redeemed_at', sevenDaysAgo)
      redeemed = data || []
    } catch (e) {
      console.warn('Could not fetch rewards for wrapped:', e)
    }

    // Calculate stats
    const tasksCompleted = completedTasks?.length || 0
    const taskTitles = completedTasks?.map(t => t.title) || []
    const focusSessions = pomodoroLogs?.filter(l => l.completed).length || 0
    const focusMinutes = pomodoroLogs?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0
    const xpFromPomodoro = pomodoroLogs?.reduce((sum, l) => sum + (l.xp_earned || 0), 0) || 0
    const rewardsRedeemed = redeemed?.length || 0
    const totalXp = profile?.xp || 0
    const currentLevel = profile?.level || 1

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

    let narrative = ''
    try {
      narrative = (await generateGeminiContent(prompt)).trim()
    } catch (aiErr) {
      console.warn('AI narrative failed, using fallback:', aiErr)
      narrative = `Hebat! Minggu ini kamu telah menyelesaikan ${tasksCompleted} tugas dan ${focusMinutes} menit fokus. Pertahankan semangatmu! 🚀`
    }

    return NextResponse.json({
      success: true,
      hasActivity: true,
      narrative,
      stats: {
        tasksCompleted,
        focusMinutes,
        focusSessions,
        xpGained: xpFromPomodoro + (tasksCompleted * 25),
        rewardsRedeemed,
        currentLevel
      }
    })
  } catch (error) {
    console.error('Error in Weekly Wrapped:', error)
    return NextResponse.json({ error: 'Failed to generate weekly wrapped' }, { status: 500 })
  }
}
