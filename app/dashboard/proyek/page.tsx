import { createClient } from '@/lib/supabase/server'
import KanbanBoard from '@/components/KanbanBoard'
import { FolderKanban } from 'lucide-react'

export default async function ProyekPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get pillars for PROYEK
  const { data: pillars } = await supabase
    .from('pillars')
    .select('*')
    .eq('user_id', user?.id || '')
    .eq('type', 'PROYEK')

  const pillarIds = (pillars as any[])?.map(p => p.id) || []

  // Get tasks for those pillars
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, pillars(name)')
    .in('pillar_id', pillarIds)
    .order('created_at', { ascending: false })

  return (
    <KanbanBoard 
      initialTasks={tasks || []} 
      pillars={pillars || []} 
      title="Proyek"
      iconNode={<FolderKanban size={32} className="text-purple-500" />}
    />
  )
}
