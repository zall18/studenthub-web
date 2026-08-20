import { UserCircle, Mail, LogOut, Bell, Shield, Settings2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Create a display name based on email
  const displayName = user.email?.split('@')[0] || 'User'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-slate-800 mb-2">Profil Pengguna</h1>
        <p className="text-slate-500">
          Kelola informasi personal dan preferensi akun Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Kartu Profil */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden group">
            {/* Dekorasi BG */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors duration-500"></div>
            
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30 mb-4 ring-4 ring-white">
                {initial}
              </div>
              <h2 className="text-xl font-bold text-slate-800 capitalize mb-1">{displayName}</h2>
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-6">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
              
              <div className="w-full h-px bg-slate-100 mb-6"></div>
              
              <form action="/auth/signout" method="post">
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  Keluar Akun
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <UserCircle className="text-blue-500" size={20} />
              Informasi Dasar
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  defaultValue={displayName}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all capitalize" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  defaultValue={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" 
                />
                <p className="text-xs text-slate-400 mt-1.5">* Email tidak dapat diubah karena ditautkan dengan akun otentikasi.</p>
              </div>
              <div className="pt-2">
                <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm shadow-md">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Settings2 className="text-amber-500" size={20} />
              Preferensi (Visual)
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="bg-amber-50 p-2.5 rounded-full text-amber-500">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">Mode Terang Otomatis</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Paksa antarmuka menjadi terang meskipun OS menggunakan mode gelap.</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-amber-400 cursor-not-allowed">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform transform translate-x-6"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="bg-green-50 p-2.5 rounded-full text-green-500">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">Notifikasi Pengingat Tugas</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Terima pengingat harian untuk tugas yang belum selesai.</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 cursor-not-allowed">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
