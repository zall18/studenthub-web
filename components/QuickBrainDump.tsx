'use client'

import { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'

export default function QuickBrainDump() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    // TODO: Connect to /api/ai/categorize endpoint
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setInput('')
    setLoading(false)
    alert('Tugas berhasil ditambahkan via Brain Dump!')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-50 p-2 rounded-full border border-slate-200 focus-within:border-[#FF9F43] focus-within:ring-2 focus-within:ring-[#FF9F43]/20 transition-all">
      <div className="bg-[#FBBF24]/20 p-2 rounded-full text-[#FBBF24]">
        <Sparkles size={20} />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ketik ide, tugas mendadak, atau catatan di sini..."
        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="bg-[#FF9F43] hover:bg-[#ff8f24] text-white p-2 rounded-full disabled:opacity-50 transition-colors"
      >
        <Send size={20} className={loading ? 'animate-pulse' : ''} />
      </button>
    </form>
  )
}
