'use client'

import { useState } from 'react'
import { Plus, GripVertical, Check, Wand2 } from 'lucide-react'
import TaskDetailModal from '@/components/TaskDetailModal'

export default function OrganisasiPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const handleOpenTask = (task: string) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-800">
            Pilar: Organisasi
          </h1>
          <p className="text-slate-500 mt-1">BEM Universitas</p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Tambah Tugas
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {/* Kolom TO-DO */}
        <div className="min-w-[300px] flex-1 bg-slate-100 rounded-3xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-700">To-Do <span className="text-slate-400 font-normal text-sm ml-2">2</span></h3>
          </div>
          
          <div 
            onClick={() => handleOpenTask("Bikin draft kalender konten untuk acara BEM bulan depan")}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-[#FF9F43] transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Wand2 size={10} /> AI Generated
              </span>
              <button className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-500 transition-opacity">
                <GripVertical size={16} />
              </button>
            </div>
            <p className="font-medium text-slate-800 text-sm leading-relaxed mb-4">
              Bikin draft kalender konten untuk acara BEM bulan depan
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">BEM Univ</span>
              <span className="text-xs text-[#FF9F43] bg-[#FF9F43]/10 px-2 py-1 rounded-md">Besok</span>
            </div>
          </div>
        </div>

        {/* Kolom DOING */}
        <div className="min-w-[300px] flex-1 bg-slate-100 rounded-3xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-700">Doing <span className="text-slate-400 font-normal text-sm ml-2">1</span></h3>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#FBBF24] cursor-pointer group">
            <p className="font-medium text-slate-800 text-sm leading-relaxed mb-4">
              Review Proposal Sponsorship
            </p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
              <div className="bg-[#FBBF24] h-1.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 text-right">45%</p>
          </div>
        </div>

        {/* Kolom DONE */}
        <div className="min-w-[300px] flex-1 bg-slate-100 rounded-3xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-700">Done <span className="text-slate-400 font-normal text-sm ml-2">1</span></h3>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#10B981] opacity-70 flex items-start gap-3">
            <div className="mt-0.5 text-[#10B981]">
              <Check size={18} />
            </div>
            <div>
              <p className="font-medium text-slate-500 text-sm line-through">
                Rapat Mingguan Divisi
              </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskDetailModal 
          taskTitle={selectedTask || ''} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}
