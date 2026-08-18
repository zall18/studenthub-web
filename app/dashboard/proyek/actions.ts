'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string
  const repo_url = formData.get('repo_url') as string
  const tech_stack_str = formData.get('tech_stack') as string
  const client_name = formData.get('client_name') as string
  const time_estimate = formData.get('time_estimate') as string
  const budget = formData.get('budget') as string

  if (!name) {
    throw new Error('Nama proyek wajib diisi')
  }

  // Parse tech stack into array
  const tech_stack = tech_stack_str 
    ? tech_stack_str.split(',').map(t => t.trim()).filter(Boolean) 
    : []

  const metadata = {
    description,
    status: status || 'Active',
    repo_url,
    tech_stack,
    client_name,
    time_estimate,
    budget
  }

  const { error } = await supabase
    .from('pillars')
    .insert({
      user_id: user.id,
      name,
      type: 'PROYEK' as const,
      metadata: metadata as any
    } as any)

  if (error) {
    console.error('Error adding project:', error)
    throw new Error('Gagal menambahkan proyek')
  }

  revalidatePath('/dashboard/proyek')
}
