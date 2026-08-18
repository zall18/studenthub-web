'use client'

import { useState } from 'react'
import { Plus, FolderKanban } from 'lucide-react'
import ProjectCard, { Project } from './ProjectCard'
import AddProjectModal from './AddProjectModal'

export default function ProyekList({ projects }: { projects: Project[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800 flex items-center gap-3">
            <FolderKanban size={28} className="text-purple-500" />
            Portofolio Proyek
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Pantau dan kelola proyek-proyek yang sedang berjalan
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors border border-slate-200"
        >
          <Plus size={18} />
          Tambah Proyek
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-slate-100 relative z-10">
            <FolderKanban size={32} className="text-purple-300" />
          </div>
          <h3 className="font-bold text-slate-700 mb-1 relative z-10">Belum Ada Proyek</h3>
          <p className="text-slate-500 text-sm max-w-sm mb-6 relative z-10">
            Mulai kelola portofoliomu. Tambahkan proyek pertamamu untuk melacak progres dan tugas.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/30 relative z-10"
          >
            <Plus size={18} />
            Tambah Proyek
          </button>
        </div>
      )}

      {isModalOpen && (
        <AddProjectModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
