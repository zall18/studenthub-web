import { LayoutDashboard, BookOpen, Users, FolderKanban } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QuickBrainDump from '@/components/QuickBrainDump'
import Sidebar from '@/components/Sidebar'
import { FocusModeProvider } from '@/components/FocusModeProvider'

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

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0]
  const userEmail = user.email

  return (
    <FocusModeProvider>
      <div className="min-h-screen bg-[#f8fafc] flex relative">
      {/* Desktop Sidebar */}
      <Sidebar userName={userName} userEmail={userEmail} />

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-24 lg:pb-0">
        
        {/* Mobile Top Header (Hidden on Desktop) */}
        <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-4 h-16 flex items-center justify-between">
            <Link href="/dashboard" className="font-heading font-extrabold text-xl tracking-tight text-[#FF9F43]">
              StudentHub<span className="text-[#10B981]"> AI</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 relative">
          {children}
          
          {/* Desktop Floating Quick Brain Dump */}
          <div className="hidden lg:block fixed bottom-8 right-8 w-96 z-50 shadow-2xl rounded-full">
            <QuickBrainDump />
          </div>
        </main>

        {/* Fixed Bottom Navigation for Mobile & Quick Brain Dump */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <QuickBrainDump />
            
            <div className="flex justify-around items-center pt-2 border-t border-slate-100">
              <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#FF9F43]">
                <LayoutDashboard size={20} />
                <span className="text-[10px] font-bold">Dashboard</span>
              </Link>
              <Link href="/dashboard/matkul" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
                <BookOpen size={20} />
                <span className="text-[10px] font-bold">Matkul</span>
              </Link>
              <Link href="/dashboard/organisasi" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
                <Users size={20} />
                <span className="text-[10px] font-bold">Organisasi</span>
              </Link>
              <Link href="/dashboard/proyek" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
                <FolderKanban size={20} />
                <span className="text-[10px] font-bold">Proyek</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </FocusModeProvider>
  )
}
