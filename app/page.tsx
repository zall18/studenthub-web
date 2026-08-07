import LoginButton from '@/components/LoginButton'
import { CheckCircle2, Calendar, LayoutList, Sparkles } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="font-heading font-extrabold text-2xl tracking-tight text-[#FF9F43]">
          StudentHub<span className="text-[#10B981]"> AI</span>
        </div>
        <LoginButton />
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBBF24]/20 text-[#FBBF24] font-bold text-sm mb-6">
          <Sparkles size={16} />
          Your Academic & Life Dashboard
        </div>
        
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-balance leading-tight mb-6">
          Kendalikan Kuliah, Organisasi, & Proyek Tanpa <span className="text-[#FF9F43] underline decoration-wavy underline-offset-8">Stres</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl text-balance mb-10">
          StudentHub AI menyatukan seluruh pilar kehidupan mahasiswamu. Masukkan idemu dan biarkan AI memilah, mengatur jadwal, hingga memecah tugas kompleks menjadi langkah kecil yang mudah dieksekusi.
        </p>

        <LoginButton />

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF9F43]/20 text-[#FF9F43] flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl">Unified Schedule</h3>
            <p className="text-slate-500">
              Satu kalender untuk semua. Gabungkan jadwal kelas, rapat BEM, dan deadline freelance tanpa takut bentrok.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
              <LayoutList size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl">Auto-Categorizer</h3>
            <p className="text-slate-500">
              Cukup ketik ide atau tugas mendadak di "Brain Dump", AI akan otomatis memindahkannya ke pilar yang tepat.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FBBF24]/20 text-[#FBBF24] flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl">AI Task Breaker</h3>
            <p className="text-slate-500">
              Tugas terlalu besar? Biarkan AI memecahnya menjadi langkah-langkah kecil (sub-tugas) yang siap dikerjakan.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} StudentHub AI. Dirancang untuk mahasiswa.
      </footer>
    </div>
  )
}
