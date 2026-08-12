import LoginButton from '@/components/LoginButton'
import { CheckCircle2, Calendar, LayoutList, Sparkles, ArrowRight, BrainCircuit, Target, Zap } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans flex flex-col selection:bg-[#FF9F43]/30">
      {/* Navbar */}
      <nav className="p-2 flex items-center justify-between max-w-7xl mx-auto w-full sticky top-0 bg-[#f8fafc]/80 backdrop-blur-md z-50">
        <div className="font-heading font-extrabold text-2xl tracking-tight text-[#FF9F43]">
          StudentHub<span className="text-[#10B981]"> AI</span>
        </div>
        <LoginButton />
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full">
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBBF24]/20 text-[#FBBF24] font-bold text-sm mb-8 animate-fade-in-up">
              <Sparkles size={16} />
              Your Academic & Life Dashboard
            </div>

            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-balance leading-tight mb-6">
              Kendalikan Kuliah, Organisasi, & Proyek Tanpa <span className="text-[#FF9F43] relative whitespace-nowrap">
                Stres
                <svg className="absolute -bottom-2 w-full h-3 text-[#FF9F43]" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 10 Q 25 20, 50 10 T 100 10" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-2xl text-balance mb-8 leading-relaxed">
              StudentHub AI menyatukan seluruh pilar kehidupan mahasiswamu. Masukkan idemu dan biarkan AI memilah, mengatur jadwal, hingga memecah tugas kompleks menjadi langkah kecil yang siap dieksekusi.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <LoginButton />
              <div className="flex items-center gap-2 text-sm text-slate-500 ml-4 font-medium">
                <CheckCircle2 size={16} className="text-[#10B981]" /> 100% Gratis
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9F43]/20 to-[#10B981]/20 rounded-[3rem] blur-3xl transform -rotate-6 scale-105"></div>
            <div className="relative bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-6 md:p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Mock Dashboard UI Graphic */}
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="w-1/3 h-2 bg-slate-100 rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-slate-50 rounded-xl w-3/4 flex items-center px-4 gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF9F43]/20"></div>
                  <div className="h-2 bg-slate-200 rounded-full w-1/2"></div>
                </div>
                <div className="h-10 bg-slate-50 rounded-xl w-full flex items-center px-4 gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/20"></div>
                  <div className="h-2 bg-slate-200 rounded-full w-2/3"></div>
                </div>
                <div className="h-10 bg-slate-50 rounded-xl w-5/6 flex items-center px-4 gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100"></div>
                  <div className="h-2 bg-slate-200 rounded-full w-1/3"></div>
                </div>
              </div>

              {/* Floating Element */}
              <div className="absolute -right-6 -bottom-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FBBF24]/20 p-2 rounded-xl text-[#FBBF24]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">AI Task Breaker</p>
                    <p className="text-[10px] text-slate-400">Tugas berhasil dipecah!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Flow Illustration */}
        <section className="bg-white py-24 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">Bagaimana AI Membantumu?</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Tiga langkah sederhana untuk mengubah *burnout* menjadi produktivitas.</p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4 relative">
              {/* Step 1 */}
              <div className="flex-1 bg-slate-50 rounded-3xl p-8 text-center relative z-10 w-full lg:max-w-xs">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-slate-400">
                  <BrainCircuit size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Brain Dump</h3>
                <p className="text-sm text-slate-500">
                  Ketik semua ide atau tugas mendadak di satu kolom tanpa perlu mikir kategori.
                </p>
              </div>

              <div className="hidden lg:flex text-slate-300">
                <ArrowRight size={32} />
              </div>

              {/* Step 2 */}
              <div className="flex-1 bg-[#10B981]/5 rounded-3xl p-8 text-center relative z-10 w-full lg:max-w-xs border border-[#10B981]/10">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-[#10B981]">
                  <LayoutList size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#10B981]">2. AI Categorizer</h3>
                <p className="text-sm text-slate-600">
                  AI otomatis memilah tugasmu ke pilar yang tepat (Matkul, Organisasi, atau Proyek).
                </p>
              </div>

              <div className="hidden lg:flex text-slate-300">
                <ArrowRight size={32} />
              </div>

              {/* Step 3 */}
              <div className="flex-1 bg-[#FF9F43]/5 rounded-3xl p-8 text-center relative z-10 w-full lg:max-w-xs border border-[#FF9F43]/10">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-[#FF9F43]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#FF9F43]">3. Task Breaker</h3>
                <p className="text-sm text-slate-600">
                  AI memecah tugas besar menjadi sub-tugas kecil yang siap dieksekusi hari ini.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits / Feature Highlights */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">Manfaat Utama</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Dirancang spesifik untuk mengatasi masalah mahasiswa dengan mobilitas tinggi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
                <Calendar size={24} />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Unified Schedule</h3>
              <p className="text-slate-500 leading-relaxed">
                Satu kalender untuk semua. Gabungkan jadwal kelas, rapat BEM, dan deadline freelance tanpa takut bentrok.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#FBBF24]/20 text-[#FBBF24] flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Anti Context-Switching</h3>
              <p className="text-slate-500 leading-relaxed">
                Tetap fokus. Catat ide dadakan lewat "Brain Dump" bar statis tanpa perlu berpindah dari halaman kerja utamamu.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Mental Overload Relief</h3>
              <p className="text-slate-500 leading-relaxed">
                Tugas menyusun proposal acara terasa berat? AI Task Breaker merombaknya menjadi checklist harian yang ringan.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Extended Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="font-heading font-extrabold text-2xl tracking-tight text-[#FF9F43] mb-4">
                StudentHub<span className="text-[#10B981]"> AI</span>
              </div>
              <p className="text-slate-500 max-w-sm mb-6">
                The Academic & Life Dashboard. Didesain khusus untuk membantu mahasiswa dengan mobilitas tinggi agar tetap produktif tanpa stres.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-4">Produk</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li><Link href="#" className="hover:text-[#FF9F43] transition-colors">Fitur Utama</Link></li>
                <li><Link href="#" className="hover:text-[#FF9F43] transition-colors">Harga</Link></li>
                <li><Link href="#" className="hover:text-[#FF9F43] transition-colors">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-4">Legal</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li><Link href="#" className="hover:text-[#FF9F43] transition-colors">Kebijakan Privasi</Link></li>
                <li><Link href="#" className="hover:text-[#FF9F43] transition-colors">Syarat Ketentuan</Link></li>
                <li><Link href="#" className="hover:text-[#FF9F43] transition-colors">Hubungi Kami</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} StudentHub AI. Dirancang untuk mahasiswa.</p>
            <div className="flex items-center gap-2">
              Dibuat dengan <span className="text-red-500">❤️</span> dan AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
