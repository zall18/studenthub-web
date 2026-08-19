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
    .eq('user_id', user?.id || '')

  const pillarIds = (pillars as any[])?.map(p => p.id) || []

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
    <div className="space-y-8 pb-10">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 overflow-hidden shadow-2xl">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-gradient-to-bl from-[#FF9F43]/30 to-[#10B981]/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-2">
              Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F43] to-[#FBBF24]">Fokusmu Hari Ini.</span>
            </h1>
            <p className="text-slate-300 flex items-center gap-2 font-medium">
              <CalendarIcon size={18} className="text-[#10B981]" />
              {format(today, 'EEEE, d MMMM yyyy', { locale: id })}
            </p>
          </div>
          
          {/* Quick Stats / Motivation */}
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
              <div className="text-2xl font-bold text-white">{tasks?.length || 0}</div>
              <div className="text-xs text-slate-300 font-medium uppercase tracking-wider mt-1">Tugas Aktif</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
              <div className="text-2xl font-bold text-white">{events?.length || 0}</div>
              <div className="text-xs text-slate-300 font-medium uppercase tracking-wider mt-1">Agenda Hari Ini</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Unified Timeline / Calendar */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-slate-800 flex items-center gap-3">
              <span className="bg-[#10B981]/20 p-2 rounded-xl text-[#10B981]">
                <Clock size={24} />
              </span>
              Jadwal Hari Ini
            </h2>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex-1 relative overflow-hidden group hover:shadow-md transition-shadow">
            {/* Soft decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
            
            <div className="space-y-6 relative z-10">
              {events && events.length > 0 ? (
                (events as any[]).map((event, idx) => {
                  const colors = getPillarColor(event.pillars?.type || '')
                  const isLast = idx === events.length - 1;
                  
                  return (
                    <div key={event.id} className="flex gap-6 relative">
                      {/* Timeline Line */}
                      {!isLast && <div className="absolute left-[39px] top-10 bottom-[-24px] w-0.5 bg-slate-100"></div>}
                      
                      <div className="w-20 text-right shrink-0">
                        <div className="text-sm font-bold text-slate-800">
                          {format(new Date(event.start_time), 'HH:mm')}
                        </div>
                        <div className="text-xs font-medium text-slate-400">
                          {format(new Date(event.end_time || event.start_time), 'HH:mm')}
                        </div>
                      </div>
                      
                      {/* Timeline Dot */}
                      <div className="relative z-10 shrink-0 mt-1.5">
                        <div className={`w-3 h-3 rounded-full ${colors.bg.replace('/10', '').replace('50', '400')} ring-4 ring-white shadow-sm`}></div>
                      </div>

                      <div className={`flex-1 ${colors.bg} hover:brightness-95 transition-all cursor-pointer border border-transparent hover:border-${colors.border.split('-')[1]}-200 p-5 rounded-2xl shadow-sm mb-2`}>
                        <h4 className={`font-bold text-lg ${colors.text} mb-1`}>{event.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${colors.bg.replace('50', '100')} ${colors.labelText}`}>
                            {event.pillars?.name || 'Umum'}
                          </span>
                          {event.location && (
                            <span className="text-xs text-slate-500 font-medium">📍 {event.location}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                  <div className="bg-white p-5 rounded-full mb-4 shadow-sm">
                    <CalendarIcon size={32} className="text-[#10B981]" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Belum ada agenda hari ini</h3>
                  <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                    Jadwal kelas, rapat, atau proyek yang berlangsung hari ini akan muncul di sini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-slate-800 flex items-center gap-3">
              <span className="bg-[#FF9F43]/20 p-2 rounded-xl text-[#FF9F43]">
                <AlertCircle size={24} />
              </span>
              Tugas Prioritas
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              {tasks && tasks.length > 0 ? (
                (tasks as any[]).map((task, idx) => (
                  <label 
                    key={task.id} 
                    className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${idx === 0 ? 'bg-[#FF9F43]/5 border-[#FF9F43]/20' : 'bg-slate-50 border-transparent hover:border-slate-200 hover:bg-slate-100/50'}`}
                  >
                    <div className="mt-0.5 relative">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 peer-checked:bg-[#10B981] peer-checked:border-[#10B981] transition-colors flex items-center justify-center">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${idx === 0 ? 'text-slate-900' : 'text-slate-700'}`}>{task.title}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md inline-block shadow-sm">
                          {task.pillars?.name || 'Umum'}
                        </span>
                        
                        {task.due_date && (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-block shadow-sm ${idx === 0 ? 'text-red-700 bg-red-100 border border-red-200' : 'text-[#FF9F43] bg-[#FF9F43]/10 border border-[#FF9F43]/20'}`}>
                            {format(new Date(task.due_date), 'd MMM')}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                 <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                   <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                     <AlertCircle size={28} className="text-slate-300" />
                   </div>
                   <h3 className="font-bold text-slate-700 text-base mb-2">Semua beres!</h3>
                   <p className="text-sm text-slate-500 mb-6 max-w-[200px] leading-relaxed">
                     Tidak ada tugas mendesak. Waktunya istirahat atau tambahkan tugas baru.
                   </p>
                   <ArrowRight size={20} className="text-slate-400 animate-bounce mt-2 hidden lg:block rotate-90" />
                 </div>
              )}
            </div>
            
            {tasks && tasks.length > 0 && (
              <Link href="/dashboard/tugas" className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200">
                Lihat Semua Tugas
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
