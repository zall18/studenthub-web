import { createClient } from '@/lib/supabase/server'
import KanbanBoard from '@/components/KanbanBoard'
import MatkulList from '@/components/matkul/MatkulList'
import { BookOpen } from 'lucide-react'

export default async function MatkulPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get pillars for MATKUL
  const { data: pillars } = await supabase
    .from('pillars')
    .select('*')
    .eq('user_id', user?.id || '')
    .eq('type', 'MATKUL')

  const pillarIds = (pillars as any[])?.map(p => p.id) || []

  // Get tasks for those pillars
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, pillars(name)')
    .in('pillar_id', pillarIds)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <MatkulList pillars={pillars || []} />
      
      <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
        <KanbanBoard 
          initialTasks={tasks || []} 
          pillars={pillars || []} 
          title="Tugas Mata Kuliah"
          iconNode={<BookOpen size={32} className="text-blue-500" />}
        />
      </div>
    </div>
  )
}
