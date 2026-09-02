'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PetType, PetState } from '@/types/database'

export async function updatePetType(petType: PetType) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase
    .from('profiles') as any)
    .update({ pet_type: petType })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating pet type:', error)
    if (error.code === '42703' || error.message?.includes('column "pet_type"')) {
      throw new Error('Kolom pet_type belum ada di database Supabase. Jalankan query database_update_v2.sql di SQL Editor.')
    }
    throw new Error('Gagal mengganti peliharaan')
  }

  revalidatePath('/dashboard')
}

export async function updatePetState(state: PetState) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase
    .from('profiles') as any)
    .update({ pet_state: state })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating pet state:', error)
    throw new Error('Failed to update pet state')
  }

  revalidatePath('/dashboard')
}

export async function calculatePetMood(): Promise<PetState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return 'happy'

  try {
    // Get user's tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('status, due_date')
      .eq('user_id', user.id)

    if (!tasks || tasks.length === 0) return 'happy'

    const now = new Date()
    const overdueTasks = (tasks as any[]).filter(t => 
      t.status !== 'DONE' && 
      t.due_date && 
      new Date(t.due_date) < now
    )

    // Check recent completions (last 24h)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    const { count: recentDone } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'DONE')
      .gte('updated_at', oneDayAgo)

    // Determine mood
    if ((recentDone || 0) >= 3) return 'celebrating'
    if (overdueTasks.length >= 3) return 'tired'
    if (overdueTasks.length >= 1) return 'happy'
    
    // Check time of day - sleeping at night
    const hour = now.getHours()
    if (hour >= 23 || hour < 6) return 'sleeping'
    
    return 'happy'
  } catch (err) {
    console.warn('Error calculating pet mood:', err)
    return 'happy'
  }
}
