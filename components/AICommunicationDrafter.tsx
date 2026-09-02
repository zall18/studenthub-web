'use client'

import { useState } from 'react'
import { Send, Copy, Check, Mail, MessageCircle, Sparkles, X, Users, Building, GraduationCap, Globe, Briefcase, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface AICommunicationDrafterProps {
  taskTitle?: string
  taskDescription?: string
  defaultAudience?: 'dosen' | 'perusahaan' | 'organisasi' | 'masyarakat' | 'klien'
  isOpen: boolean
  onClose: () => void
}

type AudienceType = 'dosen' | 'perusahaan' | 'organisasi' | 'masyarakat' | 'klien' | 'custom'

const AUDIENCE_OPTIONS: { id: AudienceType; label: string; icon: any; example: string }[] = [
  { id: 'dosen', label: 'Dosen / Akademik', icon: GraduationCap, example: 'Pak izin minta waktu bimbingan revisi bab 4' },
  { id: 'perusahaan', label: 'Perusahaan / Sponsor', icon: Building, example: 'Tawaran sponsorship acara seminar nasional BEM' },
  { id: 'organisasi', label: 'Anggota / Tim', icon: Users, example: 'Pengingat kumpulin laporan divisi publikasi besok malam' },
  { id: 'masyarakat', label: 'Masyarakat / Izin Warga', icon: Globe, example: 'Surat permohonan izin kegiatan bakti sosial di balai desa' },
  { id: 'klien', label: 'Klien / Mitra Proyek', icon: Briefcase, example: 'Update progress milestone 2 aplikasi website dan jadwal demo' },
]

export default function AICommunicationDrafter({ 
  taskTitle, 
  taskDescription, 
  defaultAudience = 'dosen',
  isOpen, 
  onClose 
}: AICommunicationDrafterProps) {
  const [prompt, setPrompt] = useState('')
  const [format, setFormat] = useState<'whatsapp' | 'email'>('whatsapp')
  const [targetAudience, setTargetAudience] = useState<AudienceType>(defaultAudience)
  const [customTarget, setCustomTarget] = useState('')
  const [tone, setTone] = useState<'formal' | 'persuasif' | 'hangat'>('formal')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Sender identity fields
  const [showIdentity, setShowIdentity] = useState(false)
  const [senderName, setSenderName] = useState('')
  const [senderRole, setSenderRole] = useState('')
  const [senderOrgOrNim, setSenderOrgOrNim] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Tulis dulu pesan atau poin-poin yang ingin disampaikan!')
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
          targetAudience,
          customTarget: targetAudience === 'custom' ? customTarget : undefined,
          tone,
          senderName: senderName || undefined,
          senderRole: senderRole || undefined,
          senderOrgOrNim: senderOrgOrNim || undefined,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setDraft(data.draft)
        toast.success('Pesan formal berhasil dibuat! ✨')
      } else {
        toast.error(data.error || 'Gagal menyusun pesan')
      }
    } catch (error: any) {
      console.error(error)
      toast.error('Terjadi kesalahan koneksi AI')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      toast.success('Pesan berhasil disalin ke clipboard! 📋', {
        style: {
          borderRadius: '100px',
          background: '#f0fdf4',
          color: '#166534',
          fontWeight: 'bold'
        }
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Gagal menyalin pesan')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 border border-indigo-100 rounded-3xl p-5 space-y-4 overflow-hidden shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-indigo-100/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm text-slate-800">
                AI Communication Drafter
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pesan siap kirim ke Dosen, Sponsor, Tim Organisasi, atau Mitra
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* 1. Target Recipient Selection */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
            Target Penerima Pesan:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AUDIENCE_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const isSelected = targetAudience === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTargetAudience(opt.id)
                    if (opt.id === 'perusahaan') setTone('persuasif')
                    else if (opt.id === 'organisasi') setTone('hangat')
                    else setTone('formal')
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-white' : 'text-indigo-500'} />
                  <span className="truncate">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Format & Tone Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Channel (WhatsApp vs Email) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Saluran Pesan:
            </label>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFormat('whatsapp')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  format === 'whatsapp' 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageCircle size={13} /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setFormat('email')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  format === 'email' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail size={13} /> Email Formal
              </button>
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Gaya Bahasa (Tone):
            </label>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTone('formal')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tone === 'formal' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sopan Formal
              </button>
              <button
                type="button"
                onClick={() => setTone('persuasif')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tone === 'persuasif' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Persuasif
              </button>
              <button
                type="button"
                onClick={() => setTone('hangat')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tone === 'hangat' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Hangat Tim
              </button>
            </div>
          </div>
        </div>

        {/* 3. Sender Identity Accordion */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowIdentity(!showIdentity)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            {showIdentity ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showIdentity ? 'Sembunyikan Identitas Pengirim' : 'Opsional: Tambahkan Identitas (Nama, Jabatan, Instansi/NIM)'}
          </button>

          <AnimatePresence>
            {showIdentity && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-1"
              >
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                />
                <input
                  type="text"
                  value={senderRole}
                  onChange={(e) => setSenderRole(e.target.value)}
                  placeholder="Peran (misal: Kadiv Humas / Mahasiswa TA)"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                />
                <input
                  type="text"
                  value={senderOrgOrNim}
                  onChange={(e) => setSenderOrgOrNim(e.target.value)}
                  placeholder="NIM / Organisasi (misal: HIMA / BEM)"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Input Textarea */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Tulis ide atau poin-poin kasarmu di sini...\nContoh: "${AUDIENCE_OPTIONS.find(o => o.id === targetAudience)?.example || 'Tulis pesanmu...'}"`}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-400 min-h-[90px] resize-y bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* 5. Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md active:scale-[0.99]"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={16} />
              </motion.div>
              Menyusun Pesan Formal...
            </>
          ) : (
            <>
              <Send size={16} /> ✨ Generate Pesan {AUDIENCE_OPTIONS.find(o => o.id === targetAudience)?.label || 'Formal'}
            </>
          )}
        </button>

        {/* 6. Output Draft Result */}
        <AnimatePresence>
          {draft && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 pt-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Hasil Draft Pesan ({format.toUpperCase()}):
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Tersalin ke Clipboard!' : 'Salin Pesan'}
                </button>
              </div>
              <div className="bg-white border border-indigo-100 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap shadow-inner max-h-[320px] overflow-y-auto">
                {draft}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
