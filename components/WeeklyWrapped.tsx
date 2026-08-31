'use client'

import { useState, useEffect } from 'react'
import { X, Trophy, Clock, Zap, Gift, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface WeeklyWrappedProps {
  forceShow?: boolean
}

interface WrappedData {
  narrative: string
  hasActivity: boolean
  stats: {
    tasksCompleted: number
    focusMinutes: number
    focusSessions: number
    xpGained: number
    rewardsRedeemed: number
    currentLevel: number
  }
}

const STORAGE_KEY = 'studenthub_weekly_wrapped_seen'

export default function WeeklyWrapped({ forceShow = false }: WeeklyWrappedProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [data, setData] = useState<WrappedData | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (forceShow) {
      triggerWrapped()
      return
    }

    // Client-side check: Sunday after 19:00 WIB
    const now = new Date()
    const day = now.getDay() // 0 = Sunday
    const hour = now.getHours()
    
    if (day === 0 && hour >= 19) {
      // Check if already seen this week
      const lastSeen = localStorage.getItem(STORAGE_KEY)
      if (lastSeen) {
        const seenDate = new Date(lastSeen)
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        
        if (seenDate >= weekStart) {
          return // Already seen this week
        }
      }
      
      // Show with a small delay for better UX
      setTimeout(() => triggerWrapped(), 3000)
    }
  }, [forceShow])

  const triggerWrapped = async () => {
    setLoading(true)
    setIsVisible(true)

    try {
      const res = await fetch('/api/ai/weekly-wrapped', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await res.json()
      if (result.success) {
        setData(result)
        
        // Celebration confetti
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.3 },
            colors: ['#4F46E5', '#10B981', '#FBBF24', '#EC4899']
          })
        }, 500)
      }
    } catch (error) {
      console.error('Failed to fetch weekly wrapped:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
  }

  const slides = data ? [
    // Slide 1: Stats Overview
    {
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl mb-6"
          >
            🏆
          </motion.div>
          <h2 className="text-3xl font-heading font-extrabold text-white mb-3">
            Minggu Ini Kamu...
          </h2>
          <p className="text-white/60 text-sm mb-8">Berikut ringkasan pencapaianmu!</p>
          
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4"
            >
              <Trophy size={24} className="text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">{data.stats.tasksCompleted}</div>
              <div className="text-xs text-white/50 font-medium">Tugas Selesai</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4"
            >
              <Clock size={24} className="text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">{data.stats.focusMinutes}</div>
              <div className="text-xs text-white/50 font-medium">Menit Fokus</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4"
            >
              <Zap size={24} className="text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">{data.stats.xpGained}</div>
              <div className="text-xs text-white/50 font-medium">XP Diperoleh</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4"
            >
              <Star size={24} className="text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">Lv.{data.stats.currentLevel}</div>
              <div className="text-xs text-white/50 font-medium">Level Kamu</div>
            </motion.div>
          </div>
        </div>
      )
    },
    // Slide 2: AI Narrative
    {
      content: (
        <div className="text-center max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl mb-6"
          >
            ✨
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-lg text-white/90 leading-relaxed font-medium italic">
              &ldquo;{data.narrative}&rdquo;
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-white/40 text-xs font-medium"
          >
            — AI Asisten StudentHub
          </motion.p>
        </div>
      )
    },
  ] : []

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#312e81] via-[#4338ca] to-purple-900" />
          
          {/* Ambient stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-lg px-6">
            {/* Close */}
            <div className="absolute top-[-60px] right-0">
              <button
                onClick={handleClose}
                className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <span className="inline-block bg-white/10 backdrop-blur-md text-white/80 text-xs font-bold px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest">
                🎵 Weekly Wrapped
              </span>
            </motion.div>

            {loading ? (
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full mx-auto mb-4"
                />
                <p className="text-white/60 text-sm">Merangkum minggu-mu...</p>
              </div>
            ) : data ? (
              <>
                {/* Slide Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {slides[currentSlide]?.content}
                  </motion.div>
                </AnimatePresence>

                {/* Slide Dots */}
                <div className="flex items-center justify-center gap-2 mt-10 mb-6">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentSlide === i ? 'bg-white w-6' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-3 justify-center">
                  {currentSlide < slides.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentSlide(prev => prev + 1)}
                      className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold text-sm shadow-xl"
                    >
                      Selanjutnya →
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClose}
                      className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold text-sm shadow-xl"
                    >
                      Tutup & Istirahat 😴
                    </motion.button>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
