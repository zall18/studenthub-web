'use client'

import { useState, useEffect } from 'react'
import { Gift, Plus, ShoppingBag, Trash2, Sparkles, History, X } from 'lucide-react'
import { createReward, redeemReward, deleteReward, getRewards } from '@/app/actions/rewards'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

export default function RewardsPage() {
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCost, setNewCost] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userXp, setUserXp] = useState(0)
  const [showHistory, setShowHistory] = useState(false)

  const supabase = createClient()

  const loadRewards = async () => {
    try {
      const data = await getRewards()
      setRewards(data || [])
    } catch (e) {
      console.error('Failed to load rewards:', e)
    } finally {
      setLoading(false)
    }
  }

  const loadUserXp = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', user.id)
          .single()
        setUserXp((profile as any)?.xp || 0)
      }
    } catch (e) {
      console.error('Failed to load user XP:', e)
    }
  }

  useEffect(() => {
    loadRewards()
    loadUserXp()
  }, [])

  const handleAddReward = async () => {
    if (!newTitle.trim() || !newCost || parseInt(newCost) <= 0) {
      toast.error('Isi nama reward dan harga XP yang valid!')
      return
    }

    setIsSubmitting(true)
    try {
      await createReward(newTitle.trim(), parseInt(newCost))
      setNewTitle('')
      setNewCost('')
      setShowAddForm(false)
      toast.success('Reward baru berhasil ditambahkan! 🎁')
      await loadRewards()
    } catch (e: any) {
      toast.error(e.message || 'Gagal menambahkan reward')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRedeem = async (rewardId: string, cost: number) => {
    if (userXp < cost) {
      toast.error(`XP tidak cukup! Butuh ${cost} XP, saldo kamu ${userXp} XP`)
      return
    }

    setIsSubmitting(true)
    try {
      const result = await redeemReward(rewardId)
      
      // Mega Confetti celebration
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FF9F43', '#10B981', '#FBBF24', '#3B82F6', '#EC4899', '#8B5CF6']
      })
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF9F43', '#10B981', '#FBBF24']
        })
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3B82F6', '#EC4899', '#8B5CF6']
        })
      }, 300)

      toast.success(`🎉 Reward "${result.rewardTitle}" berhasil ditukar!`, {
        duration: 5000,
        style: {
          borderRadius: '100px',
          background: '#f0fdf4',
          color: '#166534',
          fontWeight: 'bold'
        }
      })

      setUserXp(result.newXp)
      await loadRewards()
    } catch (e: any) {
      toast.error(e.message || 'Gagal menukar reward')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (rewardId: string) => {
    setIsSubmitting(true)
    try {
      await deleteReward(rewardId)
      toast.success('Reward dihapus')
      await loadRewards()
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus reward')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableRewards = rewards.filter((r: any) => !r.is_redeemed)
  const redeemedRewards = rewards.filter((r: any) => r.is_redeemed)

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-slate-800 flex items-center gap-3">
          <Gift className="text-[#FF9F43]" size={32} />
          Self-Bribe Shop 🛍️
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-full text-sm hover:bg-slate-200 transition-colors"
          >
            <History size={16} />
            {showHistory ? 'Katalog' : 'Riwayat'}
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF9F43] text-white font-bold rounded-full text-sm hover:bg-[#ff8f24] transition-colors shadow-md"
          >
            <Plus size={16} />
            Tambah Reward
          </button>
        </div>
      </div>

      {/* XP Balance Card */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm font-medium mb-1">Saldo XP Kamu</p>
            <p className="text-4xl font-black text-white font-heading">{userXp} XP</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <Sparkles size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Add Reward Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold text-slate-800">Buat Reward Baru 🎁</h2>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Nama Reward</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder='Misal: "Jajan es krim akhir pekan"'
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Harga (XP)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="Misal: 500"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                >
                  Batal
                </button>
                <button 
                  type="button"
                  onClick={handleAddReward}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#FF9F43] text-white font-bold rounded-xl hover:bg-[#ff8f24] transition-colors text-sm shadow-md disabled:opacity-60"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Reward'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Rewards Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#FF9F43]"></div>
        </div>
      ) : (
        <>
          {!showHistory ? (
            <div>
              <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#FF9F43]" />
                Reward Tersedia ({availableRewards.length})
              </h2>
              
              {availableRewards.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift size={36} className="text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-700 mb-2">Belum ada reward</h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
                    Buat reward pertamamu sebagai motivasi menyelesaikan tugas!
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="bg-[#FF9F43] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#ff8f24] transition-colors shadow-md"
                  >
                    <Plus size={16} className="inline mr-1" /> Buat Reward Pertama
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableRewards.map((reward: any) => {
                    const canAfford = userXp >= reward.cost
                    return (
                      <motion.div
                        key={reward.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${
                          canAfford ? 'border-slate-200 hover:border-amber-300' : 'border-slate-100 opacity-70'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">{reward.title}</h3>
                            <div className="flex items-center gap-1.5">
                              <Sparkles size={14} className="text-amber-500" />
                              <span className="text-sm font-bold text-amber-600">{reward.cost} XP</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(reward.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleRedeem(reward.id, reward.cost)}
                          disabled={!canAfford || isSubmitting}
                          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                            canAfford 
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md active:scale-95' 
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? '🎉 Tukar Sekarang!' : `Butuh ${reward.cost - userXp} XP lagi`}
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                <History size={20} className="text-emerald-500" />
                Riwayat Penukaran ({redeemedRewards.length})
              </h2>
              
              {redeemedRewards.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                  <p className="text-sm text-slate-500">Belum ada reward yang ditukar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {redeemedRewards.map((reward: any) => (
                    <div key={reward.id} className="bg-white rounded-2xl border border-emerald-100 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-700">{reward.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Ditukar pada {new Date(reward.redeemed_at).toLocaleDateString('id-ID', { 
                            day: 'numeric', month: 'long', year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        -{reward.cost} XP ✅
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
