'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Mail, 
  MessageCircle, 
  Sparkles, 
  Users, 
  Building, 
  GraduationCap, 
  Globe, 
  Briefcase, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  Calendar,
  Layers,
  RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface TaskItem {
  id: string
  title: string
  description?: string
  category?: string
  due_date?: string
  status?: string
  pillars?: {
    id: string
    name: string
    type: 'MATKUL' | 'ORGANISASI' | 'PROYEK'
  }
}

interface KomunikasiClientProps {
  tasks: TaskItem[]
  initialTaskId?: string
  defaultUserName?: string
}

type AudienceType = 'dosen' | 'perusahaan' | 'organisasi' | 'masyarakat' | 'klien' | 'custom'

const AUDIENCE_CONFIG: Record<AudienceType, { label: string; icon: any; color: string; bg: string; templates: string[] }> = {
  dosen: {
    label: 'Dosen / Akademik',
    icon: GraduationCap,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200',
    templates: [
      'Mohon izin bimbingan tugas/revisi bab selanjutnya',
      'Izin berhalangan hadir kuliah karena sakit/kegiatan kampus',
      'Permohonan dispensasi keterlambatan pengumpulan tugas',
      'Pertanyaan klarifikasi materi dan instruksi tugas besar'
    ]
  },
  perusahaan: {
    label: 'Perusahaan / Sponsor',
    icon: Building,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    templates: [
      'Penawaran sponsorship dan kemitraan acara kampus',
      'Permohonan audiensi & presentasi proposal sponsorship',
      'Follow-up konfirmasi penerimaan proposal yang telah dikirim',
      'Pengajuan permohonan magang/kerja praktek mahasiswa'
    ]
  },
  organisasi: {
    label: 'Anggota / Tim Organisasi',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    templates: [
      'Pengingat deadline pengerjaan tugas divisi',
      'Undangan rapat koordinasi progres kepanitiaan',
      'Pemberitahuan hasil keputusan rapat & pembagian tugas baru',
      'Apresiasi dan evaluasi pasca acara selesai'
    ]
  },
  masyarakat: {
    label: 'Masyarakat / Warga Luar',
    icon: Globe,
    color: 'text-rose-600',
    bg: 'bg-rose-50 border-rose-200',
    templates: [
      'Surat permohonan izin penyelenggaraan bakti sosial/kegiatan',
      'Permohonan audiensi dengan pengurus RT/RW/Kelurahan',
      'Undangan kehadiran tokoh masyarakat pada pembukaan acara',
      'Pemberitahuan dan permohonan maaf atas potensi kebisingan'
    ]
  },
  klien: {
    label: 'Klien / Mitra Proyek',
    icon: Briefcase,
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200',
    templates: [
      'Update laporan progres pengerjaan milestone proyek',
      'Undangan sesi demo & review hasil prototipe',
      'Permohonan feedback dan diskusi revisi fitur',
      'Serah terima final project & dokumentasi'
    ]
  },
  custom: {
    label: 'Kustom Lainnya',
    icon: MessageSquare,
    color: 'text-slate-600',
    bg: 'bg-slate-50 border-slate-200',
    templates: [
      'Permohonan informasi dan jadwal janji temu',
      'Pesan konfirmasi kehadiran acara'
    ]
  }
}

export default function KomunikasiClient({ tasks, initialTaskId, defaultUserName = '' }: KomunikasiClientProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTaskId || '')
  const [targetAudience, setTargetAudience] = useState<AudienceType>('dosen')
  const [customTarget, setCustomTarget] = useState('')
  const [format, setFormat] = useState<'whatsapp' | 'email'>('whatsapp')
  const [tone, setTone] = useState<'formal' | 'persuasif' | 'hangat'>('formal')
  const [prompt, setPrompt] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Sender identity
  const [showIdentity, setShowIdentity] = useState(false)
  const [senderName, setSenderName] = useState(defaultUserName)
  const [senderRole, setSenderRole] = useState('')
  const [senderOrgOrNim, setSenderOrgOrNim] = useState('')

  const selectedTask = tasks.find(t => t.id === selectedTaskId)

  // When selected task changes, auto-suggest target audience
  useEffect(() => {
    if (selectedTask?.pillars?.type) {
      if (selectedTask.pillars.type === 'ORGANISASI') {
        setTargetAudience('organisasi')
        setTone('hangat')
      } else if (selectedTask.pillars.type === 'PROYEK') {
        setTargetAudience('klien')
        setTone('persuasif')
      } else {
        setTargetAudience('dosen')
        setTone('formal')
      }
    }
  }, [selectedTaskId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Tuliskan poin-poin atau ide pesan yang ingin disampaikan!')
      return
    }

    setLoading(true)
    setDraft('')

    try {
      let contextString = undefined
      if (selectedTask) {
        contextString = `Tugas: "${selectedTask.title}"`
        if (selectedTask.description) contextString += ` - Deskripsi: ${selectedTask.description}`
        if (selectedTask.pillars?.name) contextString += ` (Kategori/Pilar: ${selectedTask.pillars.name})`
        if (selectedTask.due_date) contextString += ` [Deadline: ${new Date(selectedTask.due_date).toLocaleDateString('id-ID')}]`
      }

      const res = await fetch('/api/ai/draft-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          context: contextString,
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
        toast.success('Draft pesan profesional berhasil disusun! ✨')
      } else {
        toast.error(data.error || 'Gagal menyusun pesan')
      }
    } catch (error) {
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
      toast.success('Pesan tersalin ke clipboard! 📋', {
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

  const handleShareWhatsApp = () => {
    if (!draft) return
    const url = `https://wa.me/?text=${encodeURIComponent(draft)}`
    window.open(url, '_blank')
  }

  const handleOpenEmail = () => {
    if (!draft) return
    // Extract subject if present
    let subject = 'Pemberitahuan / Koordinasi'
    let body = draft
    const subjectMatch = draft.match(/^Subject:\s*(.*)$/im)
    if (subjectMatch) {
      subject = subjectMatch[1]
      body = draft.replace(/^Subject:.*$/im, '').trim()
    }
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(url, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-800 flex items-center gap-3">
            <MessageSquare className="text-indigo-600" size={32} />
            AI Communication Drafter ✉️
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Susun pesan formal akademik, sponsorship perusahaan, permohonan izin warga, atau koordinasi tim secara instan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Context / Task Picker */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-indigo-600" />
                1. Pilih Konteks Tugas (Opsional):
              </label>
              {selectedTaskId && (
                <button
                  type="button"
                  onClick={() => setSelectedTaskId('')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
            >
              <option value="">-- Tanpa Tugas (Pesan Bebas / Umum) --</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>
                  [{t.pillars?.type || 'UMUM'}] {t.title} {t.pillars?.name ? `(${t.pillars.name})` : ''}
                </option>
              ))}
            </select>

            {/* Selected Task Preview Badge */}
            {selectedTask && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3"
              >
                <FileText size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-black text-indigo-900 truncate">{selectedTask.title}</span>
                    {selectedTask.pillars?.name && (
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {selectedTask.pillars.name}
                      </span>
                    )}
                  </div>
                  {selectedTask.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">{selectedTask.description}</p>
                  )}
                  {selectedTask.due_date && (
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-1">
                      <Calendar size={11} /> Deadline: {new Date(selectedTask.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Card 2: Target Audience */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              2. Target Penerima Pesan:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(AUDIENCE_CONFIG) as AudienceType[]).map((key) => {
                const item = AUDIENCE_CONFIG[key]
                const Icon = item.icon
                const isSelected = targetAudience === key

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setTargetAudience(key)
                      if (key === 'perusahaan') setTone('persuasif')
                      else if (key === 'organisasi') setTone('hangat')
                      else setTone('formal')
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon size={18} className={isSelected ? 'text-white' : item.color} />
                    <span className="text-xs font-black leading-tight">{item.label}</span>
                  </button>
                )
              })}
            </div>

            {targetAudience === 'custom' && (
              <input
                type="text"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                placeholder="Tuliskan target penerima (misal: Vendor Catering / Narasumber Talkshow)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            )}

            {/* Quick Starter Templates */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 mb-2">💡 Template Cepat (Klik untuk isi):</p>
              <div className="flex flex-wrap gap-1.5">
                {AUDIENCE_CONFIG[targetAudience].templates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(tpl)}
                    className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-medium px-3 py-1.5 rounded-full border border-slate-200 transition-colors text-left"
                  >
                    + {tpl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Channel, Tone & Prompt */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Channel */}
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                  Saluran Komunikasi:
                </label>
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setFormat('whatsapp')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      format === 'whatsapp' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('email')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      format === 'email' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    <Mail size={14} /> Email
                  </button>
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                  Gaya Bahasa (Tone):
                </label>
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setTone('formal')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      tone === 'formal' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Formal
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone('persuasif')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      tone === 'persuasif' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Persuasif
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone('hangat')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      tone === 'hangat' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Hangat
                  </button>
                </div>
              </div>
            </div>

            {/* Sender Identity Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowIdentity(!showIdentity)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                {showIdentity ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showIdentity ? 'Sembunyikan Identitas Pengirim' : 'Opsional: Tambahkan Identitas (Nama, Peran, NIM/Organisasi)'}
              </button>

              <AnimatePresence>
                {showIdentity && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3"
                  >
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Nama Pengirim"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-300 outline-none"
                    />
                    <input
                      type="text"
                      value={senderRole}
                      onChange={(e) => setSenderRole(e.target.value)}
                      placeholder="Peran (misal: Ketua / Mahasiswa TA)"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-300 outline-none"
                    />
                    <input
                      type="text"
                      value={senderOrgOrNim}
                      onChange={(e) => setSenderOrgOrNim(e.target.value)}
                      placeholder="NIM / Nama Organisasi"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-300 outline-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                3. Tuliskan Inti Pesan / Catatan Kasar:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Tuliskan maksud atau ide kasarmu di sini..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400 outline-none resize-y"
              />
            </div>

            {/* Submit Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles size={18} />
                  </motion.div>
                  Menyusun Draft Pesan Profesional...
                </>
              ) : (
                <>
                  <Send size={18} />
                  ✨ Generate Draft ({AUDIENCE_CONFIG[targetAudience].label})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Output & Action Buttons */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                Hasil Draft Pesan
              </h3>
              {draft && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Tersalin!' : 'Salin'}
                </button>
              )}
            </div>

            {/* Output Box */}
            {draft ? (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans max-h-[420px] overflow-y-auto shadow-inner">
                  {draft}
                </div>

                {/* Quick Share Buttons */}
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aksi Cepat:</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <MessageCircle size={15} /> Buka WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenEmail}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <Mail size={15} /> Buka Email
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
                  <MessageSquare size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium max-w-xs mx-auto">
                  Pilih target penerima dan tuliskan ide pesanmu di sebelah kiri, lalu tekan <strong className="text-indigo-600 font-bold">Generate Draft</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
