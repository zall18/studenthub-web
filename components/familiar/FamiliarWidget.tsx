'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PetType, PetState } from '@/types/database'

const PET_EMOJIS: Record<PetType, Record<PetState | 'default', string>> = {
  cat: { happy: '😺', tired: '😿', focus: '🐱', celebrating: '😸', sleeping: '😴', default: '🐱' },
  dog: { happy: '🐶', tired: '🐕', focus: '🐕‍🦺', celebrating: '🐕', sleeping: '😴', default: '🐶' },
  rabbit: { happy: '🐰', tired: '🐇', focus: '🐰', celebrating: '🐰', sleeping: '😴', default: '🐰' },
  fox: { happy: '🦊', tired: '🦊', focus: '🦊', celebrating: '🦊', sleeping: '😴', default: '🦊' },
  bird: { happy: '🐦', tired: '🐦', focus: '🦅', celebrating: '🐦', sleeping: '😴', default: '🐦' },
}

const PET_NAMES: Record<PetType, string> = {
  cat: 'Kucing',
  dog: 'Anjing',
  rabbit: 'Kelinci',
  fox: 'Rubah',
  bird: 'Burung',
}

const STATE_MESSAGES: Record<PetState, string> = {
  happy: 'sedang senang! 🎉',
  tired: 'kelelahan... istirahat dulu yuk',
  focus: 'ikut fokus bersamamu! 📚',
  celebrating: 'merayakan pencapaianmu! 🏆',
  sleeping: 'sedang tidur... zzz',
}

const STATE_ANIMATIONS: Record<PetState, any> = {
  happy: {
    y: [0, -6, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  },
  tired: {
    y: [0, 2, 0],
    opacity: [1, 0.7, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  },
  focus: {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
  },
  celebrating: {
    y: [0, -10, 0],
    rotate: [0, 15, -15, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
  },
  sleeping: {
    y: [0, 2, 0],
    rotate: [0, -5, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  },
}

// Background gradient per state
const STATE_BG: Record<PetState, string> = {
  happy: 'from-amber-50 to-orange-50',
  tired: 'from-slate-100 to-slate-50',
  focus: 'from-indigo-50 to-purple-50',
  celebrating: 'from-emerald-50 to-teal-50',
  sleeping: 'from-blue-50 to-slate-50',
}

interface FamiliarWidgetProps {
  petType: PetType
  petState: PetState
  petName?: string
  compact?: boolean
}

export default function FamiliarWidget({ 
  petType = 'cat', 
  petState = 'happy',
  petName,
  compact = false 
}: FamiliarWidgetProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  const emoji = PET_EMOJIS[petType]?.[petState] || PET_EMOJIS[petType]?.default || '🐱'
  const animation = STATE_ANIMATIONS[petState] || STATE_ANIMATIONS.happy
  const bg = STATE_BG[petState] || STATE_BG.happy
  const displayName = petName || PET_NAMES[petType] || 'Pet'
  const stateMsg = STATE_MESSAGES[petState] || ''

  if (compact) {
    return (
      <motion.div
        className="relative"
        animate={animation}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
      >
        <div className="text-2xl cursor-pointer select-none">
          {emoji}
        </div>
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-50 font-medium shadow-lg"
            >
              {displayName} {stateMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div 
      className={`bg-gradient-to-br ${bg} rounded-2xl p-4 border border-slate-100 relative overflow-hidden group cursor-pointer transition-all hover:shadow-md`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Decorative particles for celebrating */}
      {petState === 'celebrating' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: ['#FF9F43', '#10B981', '#FBBF24', '#3B82F6', '#EC4899', '#8B5CF6'][i],
                left: `${15 + i * 14}%`,
              }}
              animate={{
                y: [-10, 60],
                opacity: [1, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Focus mode rays */}
      {petState === 'focus' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-indigo-400 rounded-full blur-xl" />
        </motion.div>
      )}

      {/* Zzz for sleeping */}
      {petState === 'sleeping' && (
        <div className="absolute top-2 right-3 pointer-events-none">
          <motion.span
            className="text-xs text-blue-300 font-bold block"
            animate={{ y: [0, -8], opacity: [1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          >z</motion.span>
          <motion.span
            className="text-[10px] text-blue-200 font-bold block -mt-1"
            animate={{ y: [0, -8], opacity: [1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >z</motion.span>
          <motion.span
            className="text-[8px] text-blue-100 font-bold block -mt-1"
            animate={{ y: [0, -8], opacity: [1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
          >z</motion.span>
        </div>
      )}

      <div className="flex items-center gap-3 relative z-10">
        {/* Pet Avatar */}
        <motion.div
          className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-2xl select-none"
          animate={animation}
        >
          {emoji}
        </motion.div>

        {/* Pet Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-700 truncate">{displayName}</p>
          <p className="text-[10px] text-slate-500 font-medium truncate">
            {stateMsg}
          </p>
        </div>
      </div>

      {/* State indicator dot */}
      <div className="absolute top-3 right-3">
        <motion.div
          className={`w-2 h-2 rounded-full ${
            petState === 'happy' ? 'bg-emerald-400' :
            petState === 'focus' ? 'bg-indigo-400' :
            petState === 'celebrating' ? 'bg-amber-400' :
            petState === 'tired' ? 'bg-orange-400' :
            'bg-blue-300'
          }`}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  )
}
