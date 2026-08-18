'use client'

import { useState } from 'react'
import { X, FolderKanban, AlignLeft, Link, Code, Activity, User, Clock, DollarSign } from 'lucide-react'
import { addProject } from '@/app/dashboard/proyek/actions'

interface AddProjectModalProps {
  onClose: () => void
}

export default function AddProjectModal({ onClose }: AddProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      await addProject(formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FolderKanban size={24} className="text-purple-500" />
            Tambah Proyek Baru
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div className="flex flex-col gap-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-bold text-slate-700">Nama Proyek <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FolderKanban size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="E-Commerce Redesign"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="status" className="text-sm font-bold text-slate-700">Status</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Activity size={16} className="text-slate-400" />
                  </div>
                  <select
                    id="status"
                    name="status"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="client_name" className="text-sm font-bold text-slate-700">Nama Klien <span className="text-slate-400 font-normal">(Opsional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="client_name"
                    name="client_name"
                    placeholder="PT Bintang Jaya"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="time_estimate" className="text-sm font-bold text-slate-700">Estimasi</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="time_estimate"
                      name="time_estimate"
                      placeholder="3 Bulan"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="budget" className="text-sm font-bold text-slate-700">Budget</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="budget"
                      name="budget"
                      placeholder="Rp 5.000.000"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="flex flex-col gap-5">
              <div className="space-y-1.5">
                <label htmlFor="repo_url" className="text-sm font-bold text-slate-700">URL / Tautan <span className="text-slate-400 font-normal">(Opsional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="url"
                    id="repo_url"
                    name="repo_url"
                    placeholder="https://github.com/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tech_stack" className="text-sm font-bold text-slate-700">Tech Stack</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <Code size={16} className="text-slate-400" />
                  </div>
                  <textarea
                    id="tech_stack"
                    name="tech_stack"
                    rows={2}
                    placeholder="React, Next.js, TailwindCSS (Pisahkan dengan koma)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm resize-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Gunakan koma (,) untuk memisahkan setiap teknologi.</p>
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col">
                <label htmlFor="description" className="text-sm font-bold text-slate-700">Deskripsi Singkat</label>
                <div className="relative flex-1 flex flex-col">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <AlignLeft size={16} className="text-slate-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Ceritakan sedikit tentang proyek ini..."
                    className="w-full flex-1 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-70 font-bold rounded-xl transition-colors text-sm flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Proyek'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
