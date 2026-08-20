'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type Pillar = Database['public']['Tables']['pillars']['Row']

interface MatkulFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  matkul?: Pillar | null
}

export default function MatkulFormModal({ isOpen, onClose, onSaved, matkul }: MatkulFormModalProps) {
  const [name, setName] = useState('')
  const [semester, setSemester] = useState<number | ''>('')
  const [sks, setSks] = useState<number | ''>('')
  
  // Jadwal array
  const [jadwal, setJadwal] = useState<{day: string, start: string, end: string, room: string}[]>([])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (matkul) {
      setName(matkul.name)
      setSemester(matkul.semester || '')
      setSks(matkul.sks || '')
      if (matkul.jadwal && Array.isArray(matkul.jadwal)) {
        setJadwal(matkul.jadwal as any)
      } else {
        setJadwal([])
      }
    } else {
      setName('')
      setSemester('')
      setSks('')
      setJadwal([])
    }
  }, [matkul, isOpen])

  if (!isOpen) return null

  const handleAddJadwal = () => {
    setJadwal([...jadwal, { day: 'Senin', start: '08:00', end: '10:00', room: '' }])
  }

  const handleUpdateJadwal = (index: number, field: string, value: string) => {
    const newJadwal = [...jadwal]
    newJadwal[index] = { ...newJadwal[index], [field]: value }
    setJadwal(newJadwal)
  }

  const handleRemoveJadwal = (index: number) => {
    setJadwal(jadwal.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const payload: Database['public']['Tables']['pillars']['Update'] = {
        name,
        semester: semester ? Number(semester) : null,
        sks: sks ? Number(sks) : null,
        jadwal: jadwal.length > 0 ? (jadwal as any) : null,
        type: 'MATKUL',
        user_id: user.id
      }

      if (matkul?.id) {
        // Update
        const { error } = await (supabase.from('pillars') as any)
          .update(payload)
          .eq('id', matkul.id)
        if (error) throw error
      } else {
        // Insert
        const { error } = await (supabase.from('pillars') as any)
          .insert([payload])
        if (error) throw error
      }
      
      onSaved()
      onClose()
    } catch (error) {
      console.error('Error saving matkul:', error)
      alert('Gagal menyimpan mata kuliah')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {matkul ? 'Edit Mata Kuliah' : 'Mata Kuliah Baru'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Mata Kuliah *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Contoh: Pemrograman Web"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={semester}
                onChange={e => setSemester(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Misal: 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKS
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={sks}
                onChange={e => setSks(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Misal: 3"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Jadwal
              </label>
              <button 
                type="button" 
                onClick={handleAddJadwal}
                className="text-xs flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={14} className="mr-1" /> Tambah Jadwal
              </button>
            </div>
            
            {jadwal.length === 0 ? (
              <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
                Belum ada jadwal yang ditambahkan.
              </div>
            ) : (
              <div className="space-y-3">
                {jadwal.map((j, i) => (
                  <div key={i} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <select
                        value={j.day}
                        onChange={e => handleUpdateJadwal(i, 'day', e.target.value)}
                        className="px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                      >
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Ruang"
                        value={j.room}
                        onChange={e => handleUpdateJadwal(i, 'room', e.target.value)}
                        className="px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="time"
                        value={j.start}
                        onChange={e => handleUpdateJadwal(i, 'start', e.target.value)}
                        className="px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="time"
                        value={j.end}
                        onChange={e => handleUpdateJadwal(i, 'end', e.target.value)}
                        className="px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoveJadwal(i)}
                      className="text-red-500 hover:bg-red-50:bg-red-900/30 p-1.5 rounded-md transition-colors mt-0.5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50:bg-gray-600 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}
