import { createClient } from '@/lib/supabase/server'
import { Calendar as CalendarIcon, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = new Date()

  // Fetch real data
  const { data: { user } } = await supabase.auth.getUser()

  // Get user's pillars
  const { data: pillars } = await supabase
    .from('pillars')
    .select('id, name, type')
    .eq('user_id', user?.id)

  const pillarIds = pillars?.map(p => p.id) || []

  // Get tasks that are due today or urgent
  // If no pillars yet, this will be empty
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, pillars(name, type)')
    .in('pillar_id', pillarIds)
    .neq('status', 'DONE')
    .order('due_date', { ascending: true })
    .limit(5)

  // Get events (Jadwal Hari Ini)
  const todayStart = new Date(today.setHours(0,0,0,0)).toISOString()
  const todayEnd = new Date(today.setHours(23,59,59,999)).toISOString()

  const { data: events } = await supabase
    .from('events')
    .select('*, pillars(name, type)')
    .in('pillar_id', pillarIds)
    .gte('start_time', todayStart)
    .lte('start_time', todayEnd)
    .order('start_time', { ascending: true })

  const getPillarColor = (type: string) => {
    switch (type) {
      case 'MATKUL': return { border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-900', labelText: 'text-blue-700' }
      case 'ORGANISASI': return { border: 'border-[#FBBF24]', bg: 'bg-[#FBBF24]/10', text: 'text-amber-900', labelText: 'text-amber-700' }
      case 'PROYEK': return { border: 'border-purple-400', bg: 'bg-purple-50', text: 'text-purple-900', labelText: 'text-purple-700' }
      default: return { border: 'border-slate-400', bg: 'bg-slate-50', text: 'text-slate-900', labelText: 'text-slate-700' }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-slate-800">
          Halo, ini fokusmu hari ini.
        </h1>
        <p className="text-slate-500 mt-2 flex items-center gap-2">
          <CalendarIcon size={18} />
          {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Unified Timeline / Calendar */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
              <Clock size={24} className="text-[#10B981]" />
              Jadwal Hari Ini
            </h2>
          </div>
          
          <div className="space-y-4 flex-1">
            {events && events.length > 0 ? (
              events.map(event => {
                const colors = getPillarColor(event.pillars?.type || '')
                return (
                  <div key={event.id} className="flex gap-4">
                    <div className="w-20 text-right text-sm font-medium text-slate-400 pt-1">
                      {format(new Date(event.start_time), 'HH:mm')}
                    </div>
                    <div className={`flex-1 ${colors.bg} border-l-4 ${colors.border} p-4 rounded-r-xl`}>
                      <h4 className={`font-bold ${colors.text}`}>{event.title}</h4>
                      <p className={`text-sm ${colors.labelText}`}>{event.pillars?.name || 'Umum'}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-2xl">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <CalendarIcon size={32} className="text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700 mb-1">Belum ada agenda hari ini</h3>
                <p className="text-sm text-slate-500 max-w-xs">
                  Jadwal kelas, rapat, atau proyek yang berlangsung hari ini akan muncul di sini.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
              <AlertCircle size={24} className="text-[#FF9F43]" />
              Tugas Aktif
            </h2>
          </div>

          <div className="space-y-3 flex-1">
            {tasks && tasks.length > 0 ? (
              tasks.map(task => (
                <label key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-[#10B981] focus:ring-[#10B981]" />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                        {task.pillars?.name || 'Umum'}
                      </span>
                      {task.due_date && (
                        <span className="text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/10 px-2 py-0.5 rounded-full inline-block">
                          {format(new Date(task.due_date), 'd MMM')}
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl">
                 <AlertCircle size={24} className="text-slate-300 mb-3" />
                 <h3 className="font-bold text-slate-700 text-sm mb-1">Semua beres!</h3>
                 <p className="text-xs text-slate-500 mb-4">
                   Gunakan Brain Dump di bawah untuk mencatat tugas baru.
                 </p>
                 <ArrowRight size={16} className="text-slate-300 animate-bounce mt-4 hidden lg:block rotate-90" />
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
