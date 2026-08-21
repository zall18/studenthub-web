'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Focus } from 'lucide-react'

type FocusModeContextType = {
  isFocusMode: boolean
  toggleFocusMode: () => void
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined)

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false)

  const toggleFocusMode = () => setIsFocusMode(prev => !prev)

  // Optional: Add keyboard shortcut to toggle (e.g., Ctrl+Shift+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        toggleFocusMode()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode }}>
      <div className={`transition-all duration-500 ease-in-out min-h-screen ${isFocusMode ? 'focus-mode-active bg-slate-900' : ''}`}>
        {children}
      </div>
      
      {/* Floating Toggle Button */}
      <button 
        onClick={toggleFocusMode}
        className={`fixed top-4 right-4 z-[100] p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 flex items-center gap-2 ${
          isFocusMode 
            ? 'bg-slate-800/80 text-amber-400 hover:bg-slate-700 border border-slate-700' 
            : 'bg-white/80 text-slate-500 hover:bg-white border border-slate-200'
        }`}
        title="Toggle Focus Mode (Ctrl+Shift+F)"
      >
        <Focus size={20} className={isFocusMode ? 'animate-pulse' : ''} />
        {isFocusMode && <span className="text-sm font-bold pr-1">Focus Mode</span>}
      </button>
    </FocusModeContext.Provider>
  )
}

export function useFocusMode() {
  const context = useContext(FocusModeContext)
  if (context === undefined) {
    throw new Error('useFocusMode must be used within a FocusModeProvider')
  }
  return context
}
