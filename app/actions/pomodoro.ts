'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logPomodoroSession(taskId: string | null, duration: number, completed: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Calculate XP: 50 base XP for completed session, scaled by duration
  const baseXp = completed ? 50 : 10
  const multiplier = duration >= 25 ? 1.5 : 1 // Bonus for full 25-min sessions
  const xpEarned = Math.round(baseXp * multiplier)

  // Log the session
  const { error: logError } = await supabase
    .from('pomodoro_logs')
    .insert({
      user_id: user.id,
      task_id: taskId,
      duration,
      completed,
      xp_earned: xpEarned,
    } as any)

  if (logError) {
    console.error('Error logging pomodoro:', logError)
    throw new Error('Failed to log pomodoro session')
  }

  // Update focus_minutes in profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level, focus_minutes')
    .eq('id', user.id)
    .single()

  const currentXp = (profile as any)?.xp || 0
  const currentFocusMinutes = (profile as any)?.focus_minutes || 0
  const newXp = currentXp + xpEarned
  const newLevel = Math.floor(newXp / 100) + 1
  const prevLevel = (profile as any)?.level || 1
  const levelUp = newLevel > prevLevel

  const { error: profileError } = await (supabase
    .from('profiles') as any)
    .update({
      xp: newXp,
      level: newLevel,
      focus_minutes: currentFocusMinutes + duration,
      pet_state: 'happy', // Pet becomes happy after focus session
    })
    .eq('id', user.id)

  if (profileError) {
    console.error('Error updating profile:', profileError)
    throw new Error('Failed to update profile')
  }

  revalidatePath('/dashboard')
  return { xpEarned, newXp, newLevel, levelUp }
}

export async function getPomodoroStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: logs } = await supabase
    .from('pomodoro_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo)

  const totalSessions = logs?.length || 0
  const completedSessions = (logs as any[])?.filter(l => l.completed).length || 0
  const totalMinutes = (logs as any[])?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0
  const totalXp = (logs as any[])?.reduce((sum, l) => sum + (l.xp_earned || 0), 0) || 0
  const focusRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

  return { totalSessions, completedSessions, totalMinutes, totalXp, focusRate }
}
