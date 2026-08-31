'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { PetType } from '@/types/database'

const PET_OPTIONS: { type: PetType; emoji: string; name: string }[] = [
  { type: 'cat', emoji: '🐱', name: 'Kucing' },
  { type: 'dog', emoji: '🐶', name: 'Anjing' },
  { type: 'rabbit', emoji: '🐰', name: 'Kelinci' },
  { type: 'fox', emoji: '🦊', name: 'Rubah' },
  { type: 'bird', emoji: '🐦', name: 'Burung' },
]

interface PetSelectorProps {
  currentPet: PetType
  onSelect: (petType: PetType) => void
  isOpen: boolean
  onClose: () => void
}

export default function PetSelector({ currentPet, onSelect, isOpen, onClose }: PetSelectorProps) {
  const [selected, setSelected] = useState<PetType>(currentPet)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-6 text-center">
          <h2 className="text-2xl font-heading font-extrabold text-white mb-1">
            Pilih Peliharaanmu! 🐾
          </h2>
          <p className="text-amber-100 text-sm font-medium">
            Familiar akan menemanimu di setiap sesi belajar
          </p>
        </div>

        {/* Pet Grid */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {PET_OPTIONS.map((pet) => (
              <motion.button
                key={pet.type}
                onClick={() => setSelected(pet.type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  selected === pet.type 
                    ? 'border-amber-400 bg-amber-50 shadow-md' 
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <motion.span 
                  className="text-4xl select-none"
                  animate={selected === pet.type ? { 
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {pet.emoji}
                </motion.span>
                <span className={`text-xs font-bold ${selected === pet.type ? 'text-amber-700' : 'text-slate-500'}`}>
                  {pet.name}
                </span>
                {selected === pet.type && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" viewBox="0 0 14 10" fill="none">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onSelect(selected)
                onClose()
              }}
              className="flex-1 py-3 px-4 bg-amber-400 text-white font-bold rounded-xl hover:bg-amber-500 transition-colors text-sm shadow-md"
            >
              Pilih {PET_OPTIONS.find(p => p.type === selected)?.name}! 🎉
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
