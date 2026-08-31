'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FolderKanban, 
  Settings, 
  UserCircle,
  LogOut,
  Trophy,
  Gift,
  Timer,
  Play,
  Shield
} from 'lucide-react'

import { useFocusMode } from './FocusModeProvider'
import FamiliarWidget from './familiar/FamiliarWidget'
import PetSelector from './familiar/PetSelector'
import { updatePetType } from '@/app/actions/familiar'
import type { PetType, PetState } from '@/types/database'
import toast from 'react-hot-toast'

export default function Sidebar({ 
  userEmail, 
  userName,
  userXp = 0,
  userLevel = 1,
  petType = 'cat' as PetType,
  petState = 'happy' as PetState,
  focusMinutes = 0,
}: { 
  userEmail?: string, 
  userName?: string,
  userXp?: number,
  userLevel?: number,
  petType?: PetType,
  petState?: PetState,
  focusMinutes?: number,
}) {
  const pathname = usePathname()
  const { isFocusMode, startPomodoro } = useFocusMode()
  const [currentPet, setCurrentPet] = useState<PetType>(petType)
  const [isPetSelectorOpen, setIsPetSelectorOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pencapaian', href: '/dashboard/pencapaian', icon: Trophy },
    { name: 'Rewards', href: '/dashboard/rewards', icon: Gift },
    { name: 'Matkul', href: '/dashboard/matkul', icon: BookOpen },
    { name: 'Organisasi', href: '/dashboard/organisasi', icon: Users },
    { name: 'Proyek', href: '/dashboard/proyek', icon: FolderKanban },
  ]

  const bottomItems = [
    { name: 'Management', href: '/dashboard/management', icon: Settings },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(path)
  }

  const handleSelectPet = async (newPet: PetType) => {
    setCurrentPet(newPet)
    try {
      await updatePetType(newPet)
      toast.success('Peliharaan berhasil diganti! 🐾', {
        style: {
          borderRadius: '100px',
          background: '#fef3c7',
          color: '#92400e',
          fontWeight: 'bold'
        }
      })
    } catch (e) {
      toast.error('Gagal mengganti peliharaan')
    }
  }

  const handleStartSidebarPomodoro = () => {
    startPomodoro({
      id: 'sidebar-quick-focus',
      title: 'Sesi Fokus Mandiri 🍅'
    })
  }

  if (isFocusMode) return null;

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 py-6 px-4">
        {/* Logo */}
        <div className="mb-6 px-2">
          <Link href="/dashboard" className="font-heading font-extrabold text-2xl tracking-tight text-[#FF9F43]">
            StudentHub<span className="text-[#10B981]"> AI</span>
          </Link>
        </div>

        {/* Familiar Widget with Click to Change */}
        <div className="px-1 mb-4">
          <FamiliarWidget 
            petType={currentPet} 
            petState={petState} 
            onClick={() => setIsPetSelectorOpen(true)}
          />
        </div>

        {/* Quick Pomodoro Launcher Button in Sidebar */}
        <div className="px-1 mb-6">
          <button
            onClick={handleStartSidebarPomodoro}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Timer size={18} className="text-white animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-black tracking-wide leading-tight">Mulai Pomodoro</p>
                <p className="text-[10px] text-indigo-200 font-medium">25 Menit Fokus</p>
              </div>
            </div>
            <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
              +50 XP
            </span>
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pilar Utama</p>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
                  active 
                    ? 'bg-[#FF9F43]/10 text-[#FF9F43]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon size={18} className={active ? 'text-[#FF9F43]' : 'text-slate-400'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Nav (Settings, Profile, Logout) */}
        <div className="pt-4 border-t border-slate-100 mt-2">
          <div className="space-y-1 mb-4">
             {bottomItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
                    active 
                      ? 'bg-slate-100 text-slate-800' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-slate-800' : 'text-slate-400'} />
                  {item.name}
                </Link>
              )
            })}
          </div>
          
          <div className="px-2">
            {/* User Info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-slate-800 truncate">{userName || 'User'}</span>
                <span className="text-[10px] text-slate-400 truncate">{userEmail}</span>
              </div>
              <form action="/auth/signout" method="post">
                <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Log Out">
                  <LogOut size={16} />
                </button>
              </form>
            </div>
            
            {/* Gamification Stats */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 relative overflow-hidden group">
              {/* Level Badge */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1 text-amber-500">
                  <Shield size={14} className="fill-amber-100" />
                  <span className="text-[11px] font-bold font-heading">Level {userLevel}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{userXp} XP</span>
              </div>
              
              {/* XP Bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-400 h-1.5 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${Math.min((userXp % 100) / 100 * 100, 100)}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </div>
              </div>

              {/* Focus Minutes */}
              {focusMinutes > 0 && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-100">
                  <p className="text-[9px] text-center text-indigo-500 font-bold">
                    🍅 {focusMinutes} menit fokus total
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Pet Selector Modal */}
      <PetSelector
        currentPet={currentPet}
        isOpen={isPetSelectorOpen}
        onSelect={handleSelectPet}
        onClose={() => setIsPetSelectorOpen(false)}
      />
    </>
  )
}
