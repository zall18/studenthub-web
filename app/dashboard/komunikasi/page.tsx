import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import KomunikasiClient from './KomunikasiClient'

export default async function KomunikasiPage({
  searchParams,
}: {
  searchParams: Promise<{ taskId?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { taskId } = await searchParams

  // Fetch all active/relevant tasks for context selection
  let tasks: any[] = []
  try {
    const { data } = await supabase
      .from('tasks')
      .select('id, title, description, category, due_date, status, pillars(id, name, type)')
      .eq('user_id', user.id)
      .neq('status', 'DONE')
      .order('due_date', { ascending: true, nullsFirst: false })

    tasks = data || []
  } catch (err) {
    console.warn('Could not fetch tasks for communication drafter:', err)
  }

  // Fetch user profile for default sender identity
  let defaultUserName = user.user_metadata?.full_name || user.email?.split('@')[0] || ''

  return (
    <KomunikasiClient 
      tasks={tasks} 
      initialTaskId={taskId} 
      defaultUserName={defaultUserName} 
    />
  )
}
