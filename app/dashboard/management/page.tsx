import { Settings, BookOpen, Users, Briefcase, CheckCircle2, Circle, Wand2, Shield, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ManagementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let matkulCount = 0
  let orgCount = 0
  let projectCount = 0
  let totalTasks = 0
  let completedTasks = 0

  if (user) {
    // Get pillar counts
    const { data: pillars } = await supabase
      .from('pillars')
      .select('type')
      .eq('user_id', user.id)

    if (pillars) {
      const pData = pillars as any[]
      matkulCount = pData.filter(p => p.type === 'MATKUL').length
      orgCount = pData.filter(p => p.type === 'ORGANISASI').length
      projectCount = pData.filter(p => p.type === 'PROYEK').length
    }

    // Get task counts
    const { data: tasks } = await supabase
      .from('tasks')
      .select('status')
      .eq('user_id', user.id)

    if (tasks) {
      const tData = tasks as any[]
      totalTasks = tData.length
      completedTasks = tData.filter(t => t.status === 'DONE').length
    }
  }

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-slate-800 mb-2">Manajemen Pilar & Statistik</h1>
        <p className="text-slate-500">
          Ringkasan seluruh aktivitas, kategori pilar, dan pengaturan utama aplikasi Anda.
        </p>
      </div>

      {/* Baris Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card: Matkul */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                <BookOpen size={20} />
              </div>
              <span className="text-3xl font-heading font-black text-slate-800">{matkulCount}</span>
            </div>
            <h3 className="font-bold text-slate-600 text-sm">Total Mata Kuliah</h3>
            <Link href="/dashboard/matkul" className="inline-flex items-center gap-1 text-xs text-blue-500 font-semibold mt-2 hover:text-blue-600">
              Kelola <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Card: Organisasi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600">
                <Users size={20} />
              </div>
              <span className="text-3xl font-heading font-black text-slate-800">{orgCount}</span>
            </div>
            <h3 className="font-bold text-slate-600 text-sm">Total Organisasi</h3>
            <Link href="/dashboard/organisasi" className="inline-flex items-center gap-1 text-xs text-purple-500 font-semibold mt-2 hover:text-purple-600">
              Kelola <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Card: Proyek */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-rose-100 p-2.5 rounded-xl text-rose-600">
                <Briefcase size={20} />
              </div>
              <span className="text-3xl font-heading font-black text-slate-800">{projectCount}</span>
            </div>
            <h3 className="font-bold text-slate-600 text-sm">Total Proyek</h3>
            <Link href="/dashboard/proyek" className="inline-flex items-center gap-1 text-xs text-rose-500 font-semibold mt-2 hover:text-rose-600">
              Kelola <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Card: Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-right">
                <span className="text-3xl font-heading font-black text-slate-800">{completedTasks}</span>
                <span className="text-slate-400 font-bold text-lg">/{totalTasks}</span>
              </div>
            </div>
            <h3 className="font-bold text-slate-600 text-sm">Tugas Selesai</h3>
            
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 mb-1">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${completionRate}%` }}></div>
            </div>
            <p className="text-[10px] font-bold text-emerald-600 text-right">{completionRate}% Selesai</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kolom Kiri: AI Settings */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#FBBF24]/20 p-3 rounded-2xl text-[#FBBF24]">
              <Wand2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pengaturan AI Categorizer</h2>
              <p className="text-sm text-slate-500">Atur bagaimana asisten cerdas menangani tugas Anda.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div>
                <h4 className="font-bold text-slate-700 text-sm mb-1">Aktifkan Pengelompokan Otomatis</h4>
                <p className="text-xs text-slate-500 max-w-xs">AI akan menganalisis teks Quick Brain Dump dan memasukkannya ke Matkul/Organisasi terkait.</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-[#10B981] cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform transform translate-x-6"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 opacity-60">
              <div>
                <h4 className="font-bold text-slate-700 text-sm mb-1">Pecah Tugas Otomatis (Segera)</h4>
                <p className="text-xs text-slate-500 max-w-xs">Secara otomatis membuat sub-tugas setiap kali tugas besar dideteksi oleh AI.</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-slate-300">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Status Sistem & Privasi */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-slate-100 p-3 rounded-2xl text-slate-500">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Privasi & Sistem</h2>
              <p className="text-sm text-slate-500">Informasi mengenai sistem aplikasi.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-700 text-sm mb-2">Privasi AI</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tugas yang Anda masukkan via Quick Brain Dump dikirim ke Google Gemini AI dengan aman dan hanya digunakan untuk keperluan pengelompokan. Data Anda tidak digunakan untuk melatih model publik.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-700 text-sm">Status Database</h4>
                <p className="text-xs text-slate-500">Supabase Connected & Active</p>
              </div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
