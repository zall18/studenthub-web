'use client'

import { useState } from 'react'
import { X, Wand2, Calendar, Save, Trash2, CheckSquare, Square, Tag, AlignLeft } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function TaskDetailModal({ 
  task, 
  onClose 
}: { 
  task: any, 
  onClose: () => void 
}) {
  const [loadingAI, setLoadingAI] = useState(false)
  const [subtasks, setSubtasks] = useState<any[]>(
    (task.subtasks && task.subtasks.length > 0) ? task.subtasks : [
      { id: '1', title: 'Pahami materi yang ada', done: false },
      { id: '2', title: 'Buat draft penyelesaian', done: false },
      { id: '3', title: 'Review dan kumpulkan', done: false }
    ]
  )
  const [showAIResult, setShowAIResult] = useState(!!(task.subtasks && task.subtasks.length > 0))
  
  // State for editable fields
  const [title, setTitle] = useState(task.title || '')
  const [description, setDescription] = useState(task.description || '')
  const [category, setCategory] = useState(task.category || '')
  const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.substring(0, 16) : '')
  const [tags, setTags] = useState<string[]>(task.tags || [])

  const handleAIBreaker = async () => {
    setLoadingAI(true)
    // TODO: Call /api/ai/break-task
    await new Promise(resolve => setTimeout(resolve, 2000))
    setShowAIResult(true)
    setLoadingAI(false)
  }

  const toggleSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.map(s => s.id === subtaskId ? { ...s, done: !s.done } : s))
  }

  const progress = Math.round((subtasks.filter(s => s.done).length / subtasks.length) * 100) || 0

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {task.pillars?.name ? `Matkul > ${task.pillars.name}` : 'Umum'}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <textarea 
            className="w-full text-2xl font-heading font-extrabold text-slate-800 border-none focus:ring-0 resize-none mb-4 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
            placeholder="Judul Tugas"
          />
          
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={16} />
              <input 
                type="datetime-local" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="font-medium text-slate-600 bg-transparent border-none outline-none focus:ring-0"
              />
            </div>
            
            <div className="flex items-center gap-2 text-slate-500">
              <Tag size={16} />
              <input 
                type="text" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Kategori (Misal: Kuis, Tugas Besar)"
                className="font-medium text-slate-600 bg-transparent border-none outline-none focus:ring-0 w-48"
              />
            </div>
          </div>

          {/* AI Tags Display */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag, i) => (
                <span key={i} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
              <AlignLeft size={18} />
              <h3>Deskripsi</h3>
            </div>
            <textarea
              className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
              placeholder="Tambahkan detail deskripsi tugas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            {!showAIResult ? (
              <div className="bg-gradient-to-br from-[#FBBF24]/10 to-[#FF9F43]/10 border border-[#FBBF24]/30 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#FF9F43]">
                  <Wand2 size={32} className={loadingAI ? 'animate-bounce' : ''} />
                </div>
                <h3 className="font-heading font-bold text-lg text-amber-900 mb-2">Tugas terlalu besar?</h3>
                <p className="text-amber-700/80 text-sm mb-6 max-w-sm mx-auto">
                  Biarkan AI memecah tugas ini menjadi langkah-langkah kecil yang siap dieksekusi agar kamu tidak kewalahan.
                </p>
                <button 
                  onClick={handleAIBreaker}
                  disabled={loadingAI}
                  className="bg-[#FF9F43] hover:bg-[#ff8f24] text-white px-6 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 mx-auto"
                >
                  <Wand2 size={18} />
                  {loadingAI ? 'Memproses...' : '✨ Pecah Tugas dengan AI'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-slate-800">Langkah-langkah (Sub-tugas)</h3>
                  <span className="text-sm font-bold text-[#10B981]">{progress}%</span>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                  <div className="bg-[#10B981] h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <div 
                      key={subtask.id}
                      onClick={() => toggleSubtask(subtask.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                        subtask.done ? 'bg-[#10B981]/5 border-[#10B981]/20' : 'bg-white border-slate-200 hover:border-[#10B981]'
                      }`}
                    >
                      <button className={`mt-0.5 ${subtask.done ? 'text-[#10B981]' : 'text-slate-300'}`}>
                        {subtask.done ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                      <p className={`text-sm font-medium ${subtask.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {subtask.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button className="text-slate-400 hover:text-red-500 flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-bold">
            <Trash2 size={16} /> Hapus
          </button>
          <button 
            onClick={async () => {
              // TODO: add real save logic, we need supabase instance here
              // For now, we assume it's passed or just onClose
              const { createClient } = await import('@/lib/supabase/client')
              const supabase = createClient()
              
              const updatePayload = {
                title,
                description,
                category,
                due_date: dueDate ? new Date(dueDate).toISOString() : null,
                subtasks: showAIResult ? subtasks : null
              }

              if (task.id) {
                await (supabase.from('tasks') as any).update(updatePayload).eq('id', task.id)
              } else {
                const { data: { user } } = await supabase.auth.getUser()
                await (supabase.from('tasks') as any).insert({
                  ...updatePayload,
                  user_id: user?.id,
                  pillar_id: task.pillar_id,
                  status: 'TO_DO'
                })
              }
              onClose()
            }} 
            className="bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 px-6 py-2 rounded-full transition-colors text-sm font-bold shadow-md"
          >
            <Save size={16} /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  )
}

