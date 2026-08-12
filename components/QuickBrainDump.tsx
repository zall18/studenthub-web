'use client'

import { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'

import { useRouter } from 'next/navigation'

export default function QuickBrainDump() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    
    try {
      const res = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setInput('')
        alert(`Sukses! Tugas dikategorikan ke pilar: ${data.data.type}`)
        router.refresh()
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
        suppressHydrationWarning
        disabled={loading || !input.trim()}
        className="bg-[#FF9F43] hover:bg-[#ff8f24] text-white p-2 rounded-full disabled:opacity-50 transition-colors"
      >
        <Send size={20} className={loading ? 'animate-pulse' : ''} />
      </button>
    </form>
  )
}
