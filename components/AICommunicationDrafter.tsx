'use client'

import { useState } from 'react'
import { Send, Copy, Check, Mail, MessageCircle, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface AICommunicationDrafterProps {
  taskTitle?: string
  taskDescription?: string
  isOpen: boolean
  onClose: () => void
}

export default function AICommunicationDrafter({ 
  taskTitle, 
  taskDescription, 
  isOpen, 
  onClose 
}: AICommunicationDrafterProps) {
  const [prompt, setPrompt] = useState('')
  const [format, setFormat] = useState<'whatsapp' | 'email'>('whatsapp')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Manual identity fields
  const [showIdentity, setShowIdentity] = useState(false)
  const [userName, setUserName] = useState('')
  const [userNim, setUserNim] = useState('')
  const [userKelas, setUserKelas] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Tulis dulu pesan informalmu!')
      return
    }

    setLoading(true)
    setDraft('')

    try {
      const res = await fetch('/api/ai/draft-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          context: taskTitle ? `${taskTitle}${taskDescription ? ` - ${taskDescription}` : ''}` : undefined,
          format,
          userName: userName || undefined,
          userNim: userNim || undefined,
          userKelas: userKelas || undefined,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setDraft(data.draft)
      } else {
        toast.error('Gagal generate draft')
      }
    } catch (error) {
      console.error(error)
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      toast.success('Pesan berhasil disalin! 📋', {
        style: {
          borderRadius: '100px',
          background: '#f0fdf4',
          color: '#166534',
          fontWeight: 'bold'
        }
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Gagal menyalin')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">AI Communication Drafter</h3>
              <p className="text-[10px] text-slate-500">Ubah pesan informal → formal akademik</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Format Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setFormat('whatsapp')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              format === 'whatsapp' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <MessageCircle size={14} /> WhatsApp
          </button>
          <button
            onClick={() => setFormat('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              format === 'email' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'
            }`}
          >
            <Mail size={14} /> Email
          </button>
        </div>

        {/* Identity Toggle */}
        <button
          onClick={() => setShowIdentity(!showIdentity)}
          className="text-xs text-indigo-500 font-bold hover:text-indigo-700 transition-colors"
        >
          {showIdentity ? '▼ Sembunyikan identitas' : '▶ Tambahkan identitas (Nama, NIM, Kelas)'}
        </button>

        <AnimatePresence>
          {showIdentity && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-3 gap-2"
            >
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nama"
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="text"
                value={userNim}
                onChange={(e) => setUserNim(e.target.value)}
                placeholder="NIM"
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="text"
                value={userKelas}
                onChange={(e) => setUserKelas(e.target.value)}
                placeholder="Kelas"
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Tulis pesan informalmu di sini... misal: "Pak minta waktu buat cek prototipe tugas akhir"'
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-300 min-h-[80px] resize-y bg-white"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-md active:scale-[0.98]"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={16} />
              </motion.div>
              Sedang Menyusun Pesan...
            </>
          ) : (
            <>
              <Send size={16} /> Generate Draft
            </>
          )}
        </button>

        {/* Output */}
        <AnimatePresence>
          {draft && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hasil Draft</span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copied 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Tersalin!' : 'Salin'}
                </button>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap shadow-inner max-h-[300px] overflow-y-auto">
                {draft}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
