import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function DashboardPage() {
  const today = new Date()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-slate-800">
          Halo, ini fokusmu hari ini.
        </h1>
        <p className="text-slate-500 mt-2 flex items-center gap-2">
          <CalendarIcon size={18} />
          {format(today, 'EEEE, d MMMM yyyy', { locale: id })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Unified Timeline / Calendar */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <Clock size={24} className="text-[#10B981]" />
            Jadwal Hari Ini
          </h2>
          
          <div className="space-y-4">
            {/* Mock Schedule Item - Matkul */}
            <div className="flex gap-4">
              <div className="w-20 text-right text-sm font-medium text-slate-400 pt-1">
                08:00
              </div>
              <div className="flex-1 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
                <h4 className="font-bold text-blue-900">Studio Desain (Kuliah)</h4>
                <p className="text-sm text-blue-700">Ruang 304, Gedung B</p>
              </div>
            </div>

            {/* Mock Schedule Item - Organisasi */}
            <div className="flex gap-4">
              <div className="w-20 text-right text-sm font-medium text-slate-400 pt-1">
                13:00
              </div>
              <div className="flex-1 bg-[#FBBF24]/10 border-l-4 border-[#FBBF24] p-4 rounded-r-xl">
                <h4 className="font-bold text-amber-900">Rapat Pleno BEM</h4>
                <p className="text-sm text-amber-700">Sekretariat Mahasiswa</p>
              </div>
            </div>
            
            {/* Mock Schedule Item - Proyek */}
            <div className="flex gap-4">
              <div className="w-20 text-right text-sm font-medium text-slate-400 pt-1">
                19:00
              </div>
              <div className="flex-1 bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-xl">
                <h4 className="font-bold text-purple-900">Kerjain Revisi Logo Klien</h4>
                <p className="text-sm text-purple-700">Deadline besok pagi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <AlertCircle size={24} className="text-[#FF9F43]" />
            Tugas Urgent
          </h2>

          <div className="space-y-3">
            {/* Mock Urgent Task 1 */}
            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-[#10B981] focus:ring-[#10B981]" />
              <div>
                <p className="font-medium text-slate-800 text-sm">Upload Tugas Studio Desain</p>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full mt-1 inline-block">Due 23:59</span>
              </div>
            </label>

            {/* Mock Urgent Task 2 */}
            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-[#10B981] focus:ring-[#10B981]" />
              <div>
                <p className="font-medium text-slate-800 text-sm">Review Proposal Acara BEM</p>
                <span className="text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/10 px-2 py-0.5 rounded-full mt-1 inline-block">Besok</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
