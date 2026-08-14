'use client'

import { useState } from 'react'
import { Plus, BookOpen, Clock, CalendarDays, Edit3, Trash2 } from 'lucide-react'
import { Database } from '@/types/database'
import MatkulFormModal from './MatkulFormModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Pillar = Database['public']['Tables']['pillars']['Row']
type Jadwal = { day: string, start: string, end: string, room: string }

interface MatkulListProps {
  pillars: Pillar[]
}

export default function MatkulList({ pillars }: MatkulListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMatkul, setEditingMatkul] = useState<Pillar | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleEdit = (matkul: Pillar) => {
    setEditingMatkul(matkul)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingMatkul(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah "${name}" beserta semua tugasnya?`)) {
      try {
        const { error } = await supabase.from('pillars').delete().eq('id', id)
        if (error) throw error
        router.refresh()
      } catch (err) {
        console.error('Error deleting matkul:', err)
        alert('Gagal menghapus mata kuliah.')
      }
    }
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <BookOpen className="text-blue-500" />
            Daftar Mata Kuliah
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola mata kuliah, jadwal, dan SKS Anda semester ini.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md font-medium"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Tambah Matkul</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.length === 0 ? (
          <div className="col-span-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-blue-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Belum ada Mata Kuliah</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
              Mulai tambahkan mata kuliah Anda untuk melacak jadwal dan tugas dengan lebih baik.
            </p>
            <button
              onClick={handleAddNew}
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
            >
              Tambah Sekarang
            </button>
          </div>
        ) : (
          pillars.map(matkul => (
            <div 
              key={matkul.id} 
              className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Decorative gradient blob */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1" title={matkul.name}>
                    {matkul.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full">
                      Semester {matkul.semester || '-'}
                    </span>
                    <span className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-full">
                      {matkul.sks || '-'} SKS
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(matkul)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(matkul.id, matkul.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mt-5 relative z-10">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">
                  <CalendarDays size={16} className="text-gray-400" />
                  <h4>Jadwal Kuliah</h4>
                </div>
                
                {!matkul.jadwal || (matkul.jadwal as Jadwal[]).length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-500 italic pl-6">
                    Jadwal belum diatur
                  </p>
                ) : (
                  <div className="space-y-2 pl-6">
                    {(matkul.jadwal as Jadwal[]).map((j, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-200">{j.day}</span>
                          <span className="text-gray-500 dark:text-gray-400 mx-2">•</span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {j.start} - {j.end}
                          </span>
                        </div>
                        {j.room && (
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-medium">
                            {j.room}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <MatkulFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={() => {
          setIsModalOpen(false)
          router.refresh()
        }}
        matkul={editingMatkul} 
      />
    </div>
  )
}
