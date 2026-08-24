import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Trophy, Star, Target, Zap, Shield, Crown } from 'lucide-react'

export default async function PencapaianPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch gamification profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single()

  const userXp = (profile as any)?.xp || 0
  const userLevel = (profile as any)?.level || 1

  const { count: completedTasksCount } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'DONE')
    
  const tasksDone = completedTasksCount || 0

  // Mock Badges for now (Later can be fetched from DB)
  const badges = [
    { 
      id: 1, 
      name: 'First Blood', 
      description: 'Menyelesaikan tugas pertamamu', 
      icon: Zap, 
      unlocked: tasksDone >= 1, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-100',
      progress: Math.min(tasksDone, 1),
      max: 1
    },
    { 
      id: 2, 
      name: 'Task Master', 
      description: 'Menyelesaikan 10 tugas', 
      icon: Target, 
      unlocked: tasksDone >= 10, 
      color: 'text-blue-500', 
      bg: 'bg-blue-100',
      progress: Math.min(tasksDone, 10),
      max: 10
    },
    { 
      id: 3, 
      name: 'Night Owl', 
      description: 'Mengerjakan 5 tugas di malam hari', 
      icon: Star, 
      unlocked: false, 
      color: 'text-purple-500', 
      bg: 'bg-purple-100',
      progress: 0, // Mocked for now
      max: 5
    },
    { 
      id: 4, 
      name: 'Consistent', 
      description: 'Login 7 hari berturut-turut', 
      icon: Shield, 
      unlocked: false, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-100',
      progress: 2, // Mocked for now
      max: 7
    },
    { 
      id: 5, 
      name: 'Legendary', 
      description: 'Mencapai Level 10', 
      icon: Crown, 
      unlocked: userLevel >= 10, 
      color: 'text-rose-500', 
      bg: 'bg-rose-100',
      progress: Math.min(userLevel, 10),
      max: 10
    },
  ]

  const unlockedCount = badges.filter(b => b.unlocked).length

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      <h1 className="text-3xl font-heading font-extrabold text-slate-800 flex items-center gap-3 mb-8">
        <Trophy className="text-amber-500" size={32} />
        Pencapaian & Hadiah
      </h1>

      {/* Level Card */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white shadow-lg mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 backdrop-blur-md shadow-inner shrink-0">
            <span className="text-5xl font-black font-heading shadow-sm">{userLevel}</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Level {userLevel} Scholar</h2>
            <p className="text-amber-100 font-medium mb-6">Kamu telah mengumpulkan total {userXp} XP sejauh ini. Terus selesaikan tugas untuk naik level!</p>
            
            <div className="w-full bg-black/20 rounded-full h-3 mb-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="bg-white h-3 rounded-full relative" 
                style={{ width: `${Math.min((userXp % 100) / 100 * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
            </div>
            <p className="text-xs text-amber-100/80 font-medium text-right">
              Butuh {100 - (userXp % 100)} XP lagi menuju Level {userLevel + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Lencana Koleksi</h3>
        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm font-bold">
          {unlockedCount} / {badges.length} Terbuka
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map(badge => {
          const Icon = badge.icon
          const percent = Math.round((badge.progress / badge.max) * 100)
          
          return (
            <div 
              key={badge.id}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
                badge.unlocked 
                  ? 'bg-white border-slate-200 hover:shadow-lg hover:border-amber-300' 
                  : 'bg-slate-50 border-slate-100 opacity-80'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm ${badge.unlocked ? badge.bg : 'bg-slate-200 grayscale'}`}>
                <Icon size={32} className={badge.unlocked ? badge.color : 'text-slate-400'} />
              </div>
              <h4 className={`font-bold mb-1 ${badge.unlocked ? 'text-slate-800' : 'text-slate-500'}`}>{badge.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 h-8">{badge.description}</p>
              
              <div className="w-full mt-auto">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{badge.progress} / {badge.max}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full ${badge.unlocked ? 'bg-[#10B981]' : 'bg-slate-300'}`} 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
              
              {!badge.unlocked && (
                <div className="mt-4 text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  🔒 Terkunci
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
