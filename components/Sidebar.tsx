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
  LogOut 
} from 'lucide-react'

export default function Sidebar({ userEmail, userName }: { userEmail?: string, userName?: string }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
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

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 py-6 px-4">
      {/* Logo */}
      <div className="mb-10 px-2">
        <Link href="/dashboard" className="font-heading font-extrabold text-2xl tracking-tight text-[#FF9F43]">
          StudentHub<span className="text-[#10B981]"> AI</span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-2">
        <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Pilar Utama</p>
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
        <div className="space-y-2 mb-6">
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
        
        <div className="px-3 flex items-center justify-between">
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
      </div>
    </aside>
  )
}
