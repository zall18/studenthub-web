import { Settings } from 'lucide-react'

export default function ManagementPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="bg-slate-100 p-6 rounded-full mb-6">
        <Settings size={48} className="text-slate-400" />
      </div>
      <h1 className="text-3xl font-heading font-extrabold text-slate-800 mb-2">Manajemen Pilar</h1>
      <p className="text-slate-500 max-w-md">
        Kelola kategori pilar (Mata Kuliah, Organisasi, Proyek), edit detail organisasi, dan kelola preferensi AI Auto-Categorizer Anda di sini. (Sedang dalam pengembangan)
      </p>
    </div>
  )
}
