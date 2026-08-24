'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addXP(amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Fetch current profile
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error('Failed to fetch profile')
  }

  // Calculate new XP and Level
  const currentXp = (profile as any)?.xp || 0
  const currentLevel = (profile as any)?.level || 1
  
  const newXp = currentXp + amount
  // Logic: 100 XP = 1 Level
  const newLevel = Math.floor(newXp / 100) + 1
  const levelUp = newLevel > currentLevel

  // Upsert profile
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      xp: newXp,
      level: newLevel,
      full_name: user.user_metadata?.full_name || ''
    } as any)

  if (upsertError) {
    console.error('Error adding XP:', upsertError)
    throw new Error('Failed to update XP')
  }

  revalidatePath('/dashboard')

  return { newXp, newLevel, levelUp }
}
