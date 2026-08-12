import { UserCircle } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="bg-slate-100 p-6 rounded-full mb-6">
        <UserCircle size={48} className="text-slate-400" />
      </div>
      <h1 className="text-3xl font-heading font-extrabold text-slate-800 mb-2">Profil Pengguna</h1>
      <p className="text-slate-500 max-w-md">
        Pengaturan akun, preferensi notifikasi, dan data personal Anda akan berada di halaman ini. (Sedang dalam pengembangan)
      </p>
    </div>
  )
}
