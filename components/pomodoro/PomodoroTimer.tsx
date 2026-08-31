'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Play, Pause, RotateCcw, SkipForward, Coffee, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { logPomodoroSession } from '@/app/actions/pomodoro'
import FamiliarWidget from '@/components/familiar/FamiliarWidget'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

interface PomodoroTimerProps {
  task: { id: string; title: string } | null
  petType?: string
  onClose: () => void
  onComplete: (xpEarned: number, levelUp: boolean) => void
}

type TimerPhase = 'focus' | 'break' | 'idle'

const FOCUS_DURATION = 25 * 60 // 25 minutes in seconds
const BREAK_DURATION = 5 * 60  // 5 minutes in seconds

export default function PomodoroTimer({ task, petType = 'cat', onClose, onComplete }: PomodoroTimerProps) {
  const [phase, setPhase] = useState<TimerPhase>('idle')
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearTimer()
            handlePhaseComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearTimer()
    }

    return () => clearTimer()
  }, [isRunning, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePhaseComplete = async () => {
    setIsRunning(false)
    
    if (phase === 'focus') {
      // Focus session completed!
      try {
        const result = await logPomodoroSession(task?.id || null, 25, true)
        setSessionsCompleted(prev => prev + 1)
        
        // Confetti celebration
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#FBBF24']
        })

        toast.success(`+${result.xpEarned} XP! Sesi Pomodoro selesai! 🍅`, {
          icon: '✨',
          duration: 4000,
          style: {
            borderRadius: '100px',
            background: '#eef2ff',
            color: '#4338ca',
            fontWeight: 'bold'
          }
        })

        if (result.levelUp) {
          setTimeout(() => {
            confetti({
              particleCount: 200,
              spread: 80,
              origin: { y: 0.5 },
              colors: ['#FF9F43', '#10B981', '#FBBF24', '#3B82F6', '#EC4899']
            })
            toast.success(`🎉 Naik Level! Kamu sekarang Level ${result.newLevel}!`, {
              duration: 6000,
              icon: '🛡️'
            })
          }, 1500)
        }

        onComplete(result.xpEarned, result.levelUp)
      } catch (err) {
        console.error('Failed to log pomodoro:', err)
      }

      // Ask for break
      setPhase('break')
      setTimeLeft(BREAK_DURATION)
      
      // Auto notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🍅 Sesi Fokus Selesai!', {
          body: 'Waktunya istirahat 5 menit. Kamu hebat!',
        })
      }
    } else if (phase === 'break') {
      // Break over, ready for next focus
      setPhase('idle')
      setTimeLeft(FOCUS_DURATION)
      toast('Istirahat selesai! Siap untuk sesi berikutnya? 💪', {
        icon: '☕',
        duration: 3000,
      })
    }
  }

  const startTimer = () => {
    if (phase === 'idle') {
      setPhase('focus')
      setTimeLeft(FOCUS_DURATION)
    }
    setIsRunning(true)
    startTimeRef.current = Date.now()
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const pauseTimer = () => setIsRunning(false)

  const resetTimer = () => {
    clearTimer()
    setIsRunning(false)
    setPhase('idle')
    setTimeLeft(FOCUS_DURATION)
  }

  const skipBreak = () => {
    clearTimer()
    setIsRunning(false)
    setPhase('idle')
    setTimeLeft(FOCUS_DURATION)
  }

  const handleEndSession = async () => {
    clearTimer()
    
    // If we were in focus phase, log partial session
    if (phase === 'focus' && isRunning) {
      const elapsedMinutes = Math.round((FOCUS_DURATION - timeLeft) / 60)
      if (elapsedMinutes > 0) {
        try {
          await logPomodoroSession(task?.id || null, elapsedMinutes, false)
        } catch (err) {
          console.error('Failed to log partial session:', err)
        }
      }
    }
    
    setIsRunning(false)
    onClose()
  }

  // Format time
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  
  // Progress
  const totalDuration = phase === 'focus' ? FOCUS_DURATION : phase === 'break' ? BREAK_DURATION : FOCUS_DURATION
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        phase === 'focus' ? 'bg-gradient-to-br from-[#312e81] via-[#4338ca] to-[#4F46E5]' :
        phase === 'break' ? 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700' :
        'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900'
      }`} />
      
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              phase === 'focus' ? 'bg-indigo-300/30' : 
              phase === 'break' ? 'bg-emerald-300/30' : 'bg-slate-400/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 50],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg w-full px-4">
        {/* Close/End button */}
        <div className="absolute top-[-60px] right-0">
          <button
            onClick={handleEndSession}
            className="text-white/50 hover:text-white/90 p-2 rounded-full hover:bg-white/10 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Phase Label */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md ${
            phase === 'focus' ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/20' :
            phase === 'break' ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/20' :
            'bg-white/10 text-white/70 border border-white/10'
          }`}>
            {phase === 'focus' && <><Zap size={14} /> Mode Fokus</>}
            {phase === 'break' && <><Coffee size={14} /> Waktu Istirahat</>}
            {phase === 'idle' && '🍅 Pomodoro Timer'}
          </span>
        </motion.div>

        {/* XP Multiplier Badge */}
        {phase === 'focus' && isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            <span className="bg-amber-500/20 text-amber-300 border border-amber-400/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              ⚡ XP Multiplier 1.5x Active
            </span>
          </motion.div>
        )}

        {/* Timer Display */}
        <motion.div
          className="mb-8"
          animate={isRunning ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-8xl md:text-9xl font-black text-white font-heading tracking-tight tabular-nums">
            {timeString}
          </div>
        </motion.div>

        {/* Progress Ring */}
        <div className="mb-8">
          <div className="w-full max-w-xs mx-auto bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <motion.div
              className={`h-2 rounded-full ${
                phase === 'focus' ? 'bg-indigo-400' : 
                phase === 'break' ? 'bg-emerald-400' : 'bg-white/30'
              }`}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Task Info */}
        {task && (
          <div className="mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 max-w-sm mx-auto">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Sedang Dikerjakan</p>
            <p className="text-white font-bold truncate">{task.title}</p>
          </div>
        )}

        {/* Familiar Companion */}
        <div className="mb-8 flex justify-center">
          <FamiliarWidget
            petType={petType as any}
            petState={phase === 'focus' ? 'focus' : phase === 'break' ? 'happy' : 'happy'}
            compact
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {phase === 'idle' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startTimer}
              className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-3"
            >
              <Play size={22} fill="currentColor" />
              Mulai Fokus
            </motion.button>
          )}

          {phase !== 'idle' && (
            <>
              <button
                onClick={resetTimer}
                className="p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                title="Reset"
              >
                <RotateCcw size={22} />
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRunning ? pauseTimer : startTimer}
                className={`p-5 rounded-full font-bold text-lg shadow-xl transition-shadow ${
                  isRunning 
                    ? 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30' 
                    : 'bg-white text-indigo-700 hover:shadow-2xl'
                }`}
              >
                {isRunning ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
              </motion.button>

              {phase === 'break' && (
                <button
                  onClick={skipBreak}
                  className="p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  title="Skip Break"
                >
                  <SkipForward size={22} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Sessions Counter */}
        {sessionsCompleted > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-white/40 text-sm font-medium"
          >
            🍅 {sessionsCompleted} sesi selesai hari ini
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
