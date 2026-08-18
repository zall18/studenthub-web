'use client'

import { useState } from 'react'
import { X, Users, Briefcase, Calendar } from 'lucide-react'
import { addOrganization } from '@/app/dashboard/organisasi/actions'

interface AddOrganizationModalProps {
  onClose: () => void
}

export default function AddOrganizationModal({ onClose }: AddOrganizationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      await addOrganization(formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users size={24} className="text-[#FF9F43]" />
            Tambah Organisasi
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-bold text-slate-700">Nama Organisasi <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="BEM Fakultas Ilmu Komputer"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="role" className="text-sm font-bold text-slate-700">Jabatan <span className="text-slate-400 font-normal">(Opsional)</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                id="role"
                name="role"
                placeholder="Ketua / Anggota / Staff"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="start_year" className="text-sm font-bold text-slate-700">Tahun Masuk</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  id="start_year"
                  name="start_year"
                  placeholder="2022"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="end_year" className="text-sm font-bold text-slate-700">Tahun Keluar</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  id="end_year"
                  name="end_year"
                  placeholder="2024 / Sekarang"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-70 font-bold rounded-xl transition-colors text-sm flex items-center justify-center"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Organisasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
