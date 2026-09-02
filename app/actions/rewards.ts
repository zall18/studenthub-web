'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReward(title: string, cost: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  if (!title || cost <= 0) throw new Error('Data reward tidak valid')

  const { data, error } = await (supabase
    .from('custom_rewards') as any)
    .insert({
      user_id: user.id,
      title,
      cost,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating reward:', error)
    if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
      throw new Error('Tabel "custom_rewards" belum dibuat di Supabase. Harap jalankan script database_update_v2.sql di Supabase SQL Editor.')
    }
    throw new Error(error.message || 'Gagal membuat reward')
  }

  revalidatePath('/dashboard/rewards')
  return data
}

export async function redeemReward(rewardId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Fetch the reward
  const { data: reward, error: fetchError } = await (supabase
    .from('custom_rewards') as any)
    .select('*')
    .eq('id', rewardId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !reward) throw new Error('Reward tidak ditemukan')
  if (reward.is_redeemed) throw new Error('Reward sudah pernah ditukar')

  // Fetch user XP
  const { data: profile } = await (supabase
    .from('profiles') as any)
    .select('xp, level')
    .eq('id', user.id)
    .maybeSingle()

  const currentXp = profile?.xp || 0
  const rewardCost = reward.cost

  if (currentXp < rewardCost) {
    throw new Error(`XP tidak cukup. Saldo: ${currentXp} XP, Harga: ${rewardCost} XP`)
  }

  // Deduct XP
  const newXp = currentXp - rewardCost
  const newLevel = Math.floor(newXp / 100) + 1

  const { error: profileError } = await (supabase
    .from('profiles') as any)
    .update({ xp: newXp, level: newLevel })
    .eq('id', user.id)

  if (profileError) throw new Error('Gagal memotong saldo XP')

  // Mark reward as redeemed
  const { error: redeemError } = await (supabase
    .from('custom_rewards') as any)
    .update({ 
      is_redeemed: true,
      redeemed_at: new Date().toISOString()
    })
    .eq('id', rewardId)

  if (redeemError) throw new Error('Gagal menandai reward sebagai sudah ditukar')

  revalidatePath('/dashboard/rewards')
  revalidatePath('/dashboard')
  return { newXp, newLevel, rewardTitle: reward.title }
}

export async function deleteReward(rewardId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase
    .from('custom_rewards') as any)
    .delete()
    .eq('id', rewardId)
    .eq('user_id', user.id)
    .eq('is_redeemed', false)

  if (error) {
    console.error('Error deleting reward:', error)
    throw new Error('Gagal menghapus reward')
  }

  revalidatePath('/dashboard/rewards')
}

export async function getRewards() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  try {
    const { data, error } = await (supabase
      .from('custom_rewards') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Error fetching rewards (table might not exist yet):', error)
      return []
    }

    return data || []
  } catch (err) {
    console.warn('Error in getRewards:', err)
    return []
  }
}
