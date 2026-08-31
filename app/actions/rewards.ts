'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReward(title: string, cost: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  if (!title || cost <= 0) throw new Error('Invalid reward data')

  const { data, error } = await supabase
    .from('custom_rewards')
    .insert({
      user_id: user.id,
      title,
      cost,
    } as any)
    .select()
    .single()

  if (error) {
    console.error('Error creating reward:', error)
    throw new Error('Failed to create reward')
  }

  revalidatePath('/dashboard/rewards')
  return data
}

export async function redeemReward(rewardId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Fetch the reward
  const { data: reward, error: fetchError } = await supabase
    .from('custom_rewards')
    .select('*')
    .eq('id', rewardId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !reward) throw new Error('Reward not found')
  if ((reward as any).is_redeemed) throw new Error('Reward already redeemed')

  // Fetch user XP
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single()

  const currentXp = (profile as any)?.xp || 0
  const rewardCost = (reward as any).cost

  if (currentXp < rewardCost) {
    throw new Error('Insufficient XP')
  }

  // Deduct XP
  const newXp = currentXp - rewardCost
  const newLevel = Math.floor(newXp / 100) + 1

  const { error: profileError } = await (supabase
    .from('profiles') as any)
    .update({ xp: newXp, level: newLevel })
    .eq('id', user.id)

  if (profileError) throw new Error('Failed to deduct XP')

  // Mark reward as redeemed
  const { error: redeemError } = await (supabase
    .from('custom_rewards') as any)
    .update({ 
      is_redeemed: true,
      redeemed_at: new Date().toISOString()
    })
    .eq('id', rewardId)

  if (redeemError) throw new Error('Failed to redeem reward')

  revalidatePath('/dashboard/rewards')
  revalidatePath('/dashboard')
  return { newXp, newLevel, rewardTitle: (reward as any).title }
}

export async function deleteReward(rewardId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('custom_rewards')
    .delete()
    .eq('id', rewardId)
    .eq('user_id', user.id)
    .eq('is_redeemed', false) // Can only delete unredeemed

  if (error) {
    console.error('Error deleting reward:', error)
    throw new Error('Failed to delete reward')
  }

  revalidatePath('/dashboard/rewards')
}

export async function getRewards() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('custom_rewards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rewards:', error)
    throw new Error('Failed to fetch rewards')
  }

  return data || []
}
