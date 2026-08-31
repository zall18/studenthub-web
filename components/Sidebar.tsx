'use client'

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
  Gift
} from 'lucide-react'

import { useFocusMode } from './FocusModeProvider'
import { Shield } from 'lucide-react'
import FamiliarWidget from './familiar/FamiliarWidget'
import type { PetType, PetState } from '@/types/database'

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
  const { isFocusMode } = useFocusMode()

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

  if (isFocusMode) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 py-6 px-4">
      {/* Logo */}
      <div className="mb-8 px-2">
        <Link href="/dashboard" className="font-heading font-extrabold text-2xl tracking-tight text-[#FF9F43]">
          StudentHub<span className="text-[#10B981]"> AI</span>
        </Link>
      </div>

      {/* Familiar Widget */}
      <div className="px-1 mb-6">
        <FamiliarWidget petType={petType} petState={petState} />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-1.5">
        <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pilar Utama</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                active 
                  ? 'bg-[#FF9F43]/10 text-[#FF9F43]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon size={20} className={active ? 'text-[#FF9F43]' : 'text-slate-400'} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Nav (Settings, Profile, Logout) */}
      <div className="pt-6 border-t border-slate-100">
        <div className="space-y-1.5 mb-6">
           {bottomItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                  active 
                    ? 'bg-slate-100 text-slate-800' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon size={20} className={active ? 'text-slate-800' : 'text-slate-400'} />
                {item.name}
              </Link>
            )
          })}
        </div>
        
        <div className="px-3">
          {/* User Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-800 truncate">{userName || 'User'}</span>
              <span className="text-xs text-slate-400 truncate">{userEmail}</span>
            </div>
            <form action="/auth/signout" method="post">
              <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Log Out">
                <LogOut size={18} />
              </button>
            </form>
          </div>
          
          {/* Gamification Stats */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 relative overflow-hidden group">
            {/* Level Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-amber-500">
                <Shield size={16} className="fill-amber-100" />
                <span className="text-xs font-bold font-heading">Level {userLevel}</span>
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
            <p className="text-[9px] text-center text-slate-400 mt-2 font-medium">
              {100 - (userXp % 100)} XP lagi untuk Level {userLevel + 1}
            </p>

            {/* Focus Minutes */}
            {focusMinutes > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-[9px] text-center text-indigo-400 font-bold">
                  🍅 {focusMinutes} menit fokus total
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
