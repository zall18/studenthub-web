import { LayoutDashboard, BookOpen, Users, FolderKanban, LogOut } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QuickBrainDump from '@/components/QuickBrainDump'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative pb-24">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-heading font-extrabold text-xl tracking-tight text-[#FF9F43]">
            StudentHub<span className="text-[#10B981]"> AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 hidden sm:block">
              Halo, {user.user_metadata?.full_name || user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Fixed Bottom Navigation for Mobile & Quick Brain Dump */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <QuickBrainDump />
          
          <div className="flex justify-around items-center pt-2 border-t border-slate-100 sm:hidden">
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#FF9F43]">
              <LayoutDashboard size={20} />
              <span className="text-[10px] font-bold">Dashboard</span>
            </Link>
            <Link href="/dashboard/matkul" className="flex flex-col items-center gap-1 text-slate-400">
              <BookOpen size={20} />
              <span className="text-[10px] font-bold">Matkul</span>
            </Link>
            <Link href="/dashboard/organisasi" className="flex flex-col items-center gap-1 text-slate-400">
              <Users size={20} />
              <span className="text-[10px] font-bold">Organisasi</span>
            </Link>
            <Link href="/dashboard/proyek" className="flex flex-col items-center gap-1 text-slate-400">
              <FolderKanban size={20} />
              <span className="text-[10px] font-bold">Proyek</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
