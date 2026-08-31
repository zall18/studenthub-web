'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Focus } from 'lucide-react'
import PomodoroTimer from '@/components/pomodoro/PomodoroTimer'

type PomodoroTask = { id: string; title: string } | null

type FocusModeContextType = {
  isFocusMode: boolean
  toggleFocusMode: () => void
  // Pomodoro
  pomodoroActive: boolean
  pomodoroTask: PomodoroTask
  startPomodoro: (task: { id: string; title: string }) => void
  endPomodoro: () => void
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined)

export function FocusModeProvider({ 
  children,
  petType = 'cat'
}: { 
  children: React.ReactNode
  petType?: string 
}) {
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroTask, setPomodoroTask] = useState<PomodoroTask>(null)

  const toggleFocusMode = useCallback(() => setIsFocusMode(prev => !prev), [])

  const startPomodoro = useCallback((task: { id: string; title: string }) => {
    setPomodoroTask(task)
    setPomodoroActive(true)
    setIsFocusMode(true) // Auto-enter focus mode
  }, [])

  const endPomodoro = useCallback(() => {
    setPomodoroActive(false)
    setPomodoroTask(null)
    setIsFocusMode(false) // Auto-exit focus mode
  }, [])

  // Keyboard shortcut: Ctrl+Shift+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        if (pomodoroActive) return // Don't toggle if Pomodoro is running
        toggleFocusMode()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pomodoroActive, toggleFocusMode])

  return (
    <FocusModeContext.Provider value={{ 
      isFocusMode, 
      toggleFocusMode,
      pomodoroActive,
      pomodoroTask,
      startPomodoro,
      endPomodoro
    }}>
      <div className={`transition-all duration-500 ease-in-out min-h-screen ${isFocusMode ? 'focus-mode-active bg-slate-900' : ''}`}>
        {children}
      </div>
      
      {/* Floating Toggle Button (hidden during Pomodoro) */}
      {!pomodoroActive && (
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
      )}

      {/* Pomodoro Timer Overlay */}
      {pomodoroActive && (
        <PomodoroTimer
          task={pomodoroTask}
          petType={petType}
          onClose={endPomodoro}
          onComplete={(xpEarned, levelUp) => {
            // Could trigger UI updates here if needed
          }}
        />
      )}
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
