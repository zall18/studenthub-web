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
  MessageSquare
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
    { name: 'Komunikasi AI', href: '/dashboard/komunikasi', icon: MessageSquare },
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
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 py-5 px-4 overflow-hidden">
        {/* Logo */}
        <div className="mb-4 px-2">
          <Link href="/dashboard" className="font-heading font-extrabold text-2xl tracking-tight text-[#FF9F43]">
            StudentHub<span className="text-[#10B981]"> AI</span>
          </Link>
        </div>

        {/* Familiar Widget with Click to Change */}
        <div className="px-1 mb-3">
          <FamiliarWidget 
            petType={currentPet} 
            petState={petState} 
            onClick={() => setIsPetSelectorOpen(true)}
          />
        </div>

        {/* Quick Pomodoro Launcher Button in Sidebar */}
        <div className="px-1 mb-4">
          <button
            onClick={handleStartSidebarPomodoro}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group text-left"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Timer size={16} className="text-white animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-black tracking-wide leading-tight">Mulai Pomodoro</p>
                <p className="text-[9px] text-indigo-200 font-medium">25m Fokus</p>
              </div>
            </div>
            <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
              +50 XP
            </span>
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <p className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pilar Utama</p>
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

        {/* Bottom Nav (Settings, Profile, User Info) */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          <div className="space-y-1 mb-3">
             {bottomItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                    active 
                      ? 'bg-slate-100 text-slate-800' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-slate-800' : 'text-slate-400'} />
                  {item.name}
                </Link>
              )
            })}
          </div>
          
          {/* Compact User Info & XP Badge */}
          <div className="px-2 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-bold text-slate-800 truncate">{userName || 'User'}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-extrabold text-amber-600 bg-amber-100/70 px-1.5 py-0.2 rounded-md">
                  Lv.{userLevel}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {userXp} XP
                </span>
              </div>
            </div>
            <form action="/auth/signout" method="post">
              <button 
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </form>
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
