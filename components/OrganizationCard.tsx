'use client'

import { Users, Calendar, Briefcase, ChevronRight } from 'lucide-react'

export interface Organization {
  id: string
  name: string
  metadata: {
    role?: string
    start_year?: string
    end_year?: string
    description?: string
  } | null
}

export default function OrganizationCard({ organization }: { organization: Organization }) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const role = organization.metadata?.role || 'Anggota'
  const startYear = organization.metadata?.start_year || '-'
  const endYear = organization.metadata?.end_year || 'Sekarang'

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group flex items-start gap-4">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FF9F43] to-[#FF7B00] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#FF9F43]/20 flex-shrink-0">
        {getInitials(organization.name)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 text-lg truncate mb-1">
          {organization.name}
        </h3>
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center text-slate-500 text-sm gap-2">
            <Briefcase size={14} className="text-[#FF9F43]" />
            <span className="truncate">{role}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm gap-2">
            <Calendar size={14} className="text-[#FF9F43]" />
            <span>
              {startYear} - {endYear}
            </span>
          </div>
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-full text-slate-300 hover:text-[#FF9F43] cursor-pointer">
        <ChevronRight size={20} />
      </div>
    </div>
  )
}
