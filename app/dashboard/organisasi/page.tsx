import { createClient } from '@/lib/supabase/server'
import KanbanBoard from '@/components/KanbanBoard'
import OrganisasiList from '@/components/OrganisasiList'
import { Users, LayoutDashboard } from 'lucide-react'

export default async function OrganisasiPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get pillars for ORGANISASI
  const { data: pillars } = await supabase
    .from('pillars')
    .select('*')
    .eq('user_id', user?.id || '')
    .eq('type', 'ORGANISASI')

  const pillarIds = (pillars as any[])?.map(p => p.id) || []

  // Get tasks for those pillars
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, pillars(name)')
    .in('pillar_id', pillarIds)
    .order('created_at', { ascending: false })

  return (
    <div className="h-full flex flex-col gap-8">
      <OrganisasiList organizations={pillars || []} />
      
      <div className="border-t border-slate-200 pt-8 flex-1">
        <KanbanBoard 
          initialTasks={tasks || []} 
          pillars={pillars || []} 
          title="Tugas Organisasi"
          iconNode={<LayoutDashboard size={32} className="text-[#FF9F43]" />}
        />
      </div>
    </div>
  )
}
