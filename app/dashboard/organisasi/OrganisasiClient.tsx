'use client'

import { useState } from 'react'
import { Plus, GripVertical, Check, Wand2, Users, FileText } from 'lucide-react'
import TaskDetailModal from '@/components/TaskDetailModal'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function OrganisasiClient({ initialTasks, pillars }: { initialTasks: any[], pillars: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any | null>(null)

  const handleOpenTask = (task: any) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const todoTasks = initialTasks.filter(t => t.status === 'TO_DO')
  const doingTasks = initialTasks.filter(t => t.status === 'DOING')
  const doneTasks = initialTasks.filter(t => t.status === 'DONE')

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50 h-32">
      <FileText size={24} className="text-slate-300 mb-2" />
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-800 flex items-center gap-3">
            <Users size={32} className="text-[#FF9F43]" />
            Pilar: Organisasi
          </h1>
          <p className="text-slate-500 mt-1">
            {pillars.length > 0 
              ? pillars.map(p => p.name).join(', ') 
              : 'Belum ada organisasi yang terdaftar'}
          </p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Tambah Tugas
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {/* Kolom TO-DO */}
        <div className="min-w-[300px] flex-1 bg-slate-100/70 rounded-3xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-700">To-Do <span className="text-slate-400 font-normal text-sm ml-2">{todoTasks.length}</span></h3>
          </div>
          
          {todoTasks.length > 0 ? (
            todoTasks.map(task => (
              <div 
                key={task.id}
                onClick={() => handleOpenTask(task)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-[#FF9F43] transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  {task.is_ai_generated && (
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Wand2 size={10} /> AI Generated
                    </span>
                  )}
                  <button className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-500 transition-opacity ml-auto">
                    <GripVertical size={16} />
                  </button>
                </div>
                <p className="font-medium text-slate-800 text-sm leading-relaxed mb-4">
                  {task.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{task.pillars?.name}</span>
                  {task.due_date && (
                    <span className="text-xs text-[#FF9F43] bg-[#FF9F43]/10 px-2 py-1 rounded-md">
                      {format(new Date(task.due_date), 'd MMM', { locale: id })}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="Belum ada tugas baru." />
          )}
        </div>

        {/* Kolom DOING */}
        <div className="min-w-[300px] flex-1 bg-slate-100/70 rounded-3xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-700">Doing <span className="text-slate-400 font-normal text-sm ml-2">{doingTasks.length}</span></h3>
          </div>
          
          {doingTasks.length > 0 ? (
            doingTasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#FBBF24] cursor-pointer group" onClick={() => handleOpenTask(task)}>
                <p className="font-medium text-slate-800 text-sm leading-relaxed mb-4">
                  {task.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{task.pillars?.name}</span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="Tidak ada tugas yang sedang dikerjakan." />
          )}
        </div>

        {/* Kolom DONE */}
        <div className="min-w-[300px] flex-1 bg-slate-100/70 rounded-3xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-700">Done <span className="text-slate-400 font-normal text-sm ml-2">{doneTasks.length}</span></h3>
          </div>
          
          {doneTasks.length > 0 ? (
            doneTasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#10B981] opacity-70 flex items-start gap-3">
                <div className="mt-0.5 text-[#10B981]">
                  <Check size={18} />
                </div>
                <div>
                  <p className="font-medium text-slate-500 text-sm line-through">
                    {task.title}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="Belum ada tugas selesai." />
          )}
        </div>
      </div>

      {isModalOpen && selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}
