'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addOrganization(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const start_year = formData.get('start_year') as string
  const end_year = formData.get('end_year') as string

  if (!name) {
    throw new Error('Nama organisasi wajib diisi')
  }

  const metadata = {
    role,
    start_year,
    end_year
  }

  const { error } = await supabase
    .from('pillars')
    // @ts-ignore
    .insert({
      user_id: user.id,
      name,
      type: 'ORGANISASI' as const,
      metadata: metadata as any
    } as any)

  if (error) {
    console.error('Error adding organization:', error)
    throw new Error('Gagal menambahkan organisasi')
  }

  revalidatePath('/dashboard/organisasi')
}
