'use client'

import { useState } from 'react'
import { Sparkles, Send, Bot, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import TaskDetailModal from '@/components/TaskDetailModal'

export default function QuickBrainDump() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiMessage, setAiMessage] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<string>('')
  const [createdTask, setCreatedTask] = useState<any>(null)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    
    // Combine history with new input
    const fullInput = conversationHistory 
      ? `Konteks sebelumnya:\n${conversationHistory}\n\nJawaban/Tambahan info pengguna:\n${input}`
      : input;
      
    try {
      const res = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: fullInput })
      })
      
      const data = await res.json()
      
      if (data.requires_clarification) {
        setAiMessage(data.message)
        setConversationHistory(fullInput)
        setInput('')
      } else if (data.success) {
        setAiMessage(null)
        setConversationHistory('')
        setInput('')
        // Tampilkan modal edit
        if (data.data.task) {
          setCreatedTask({ ...data.data.task, tags: data.data.tags })
        } else {
          router.refresh()
        }
      } else {
        alert('Gagal memproses tugas: ' + data.error)
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full">
      {/* AI Chat Popup / Balloon */}
      {aiMessage && (
        <div className="absolute bottom-full left-0 mb-4 w-full bg-white rounded-2xl shadow-xl border border-amber-100 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 z-10">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2.5 rounded-full text-amber-500 shrink-0">
              <Bot size={20} />
            </div>
            <div className="flex-1 mt-0.5">
              <p className="text-sm font-semibold text-slate-700 leading-snug">{aiMessage}</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Balas di bawah untuk melengkapi info ✨</p>
            </div>
            <button 
              onClick={() => { setAiMessage(null); setConversationHistory(''); }}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-all"
            >
              <X size={16} />
            </button>
          </div>
          {/* Tail of the balloon */}
          <div className="absolute -bottom-2 left-8 w-5 h-5 bg-white border-b border-r border-amber-100 transform rotate-45 shadow-sm"></div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`flex items-center gap-2 bg-white p-2 rounded-full border shadow-sm transition-all relative z-20 ${aiMessage ? 'border-amber-400 ring-4 ring-amber-400/20' : 'border-slate-200 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/20'}`}>
        <div className="bg-amber-100 p-2.5 rounded-full text-amber-500">
          <Sparkles size={20} className={loading ? 'animate-pulse' : ''} />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={aiMessage ? "Ketik jawabanmu..." : "Ketik ide, tugas mendadak, atau catatan di sini..."}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 font-medium px-2"
          disabled={loading}
        />
        <button
          type="submit"
          suppressHydrationWarning
          disabled={loading || !input.trim()}
          className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-full disabled:opacity-50 transition-colors shadow-md flex items-center justify-center min-w-[40px]"
        >
          <Send size={18} className={loading ? 'translate-x-1 opacity-50 transition-all' : 'transition-all'} />
        </button>
      </form>

      {/* Task Detail Modal for manual editing after AI creation */}
      {createdTask && (
        <TaskDetailModal 
          task={createdTask} 
          onClose={() => {
            setCreatedTask(null)
            router.refresh()
          }} 
        />
      )}
    </div>
  )
}
