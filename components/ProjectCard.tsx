'use client'

import { FolderKanban, ExternalLink, Clock, DollarSign, User, Activity } from 'lucide-react'

export interface Project {
  id: string
  name: string
  metadata: {
    description?: string
    status?: string
    repo_url?: string
    tech_stack?: string[]
    client_name?: string
    time_estimate?: string
    budget?: string
  } | null
}

export default function ProjectCard({ project }: { project: Project }) {
  const meta = project.metadata || {}
  
  const description = meta.description || 'Tidak ada deskripsi'
  const status = meta.status || 'Active'
  const techStack = meta.tech_stack || []
  const clientName = meta.client_name || '-'
  const timeEstimate = meta.time_estimate || '-'
  const budget = meta.budget || '-'

  const statusConfig: Record<string, { bg: string, text: string, border: string }> = {
    'Active': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    'Completed': { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
    'On Hold': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  }

  const currentStatus = statusConfig[status] || statusConfig['Active']

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group flex flex-col gap-4 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors pointer-events-none"></div>

      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <FolderKanban size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg line-clamp-1 group-hover:text-purple-600 transition-colors">
              {project.name}
            </h3>
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border mt-1 ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
              <Activity size={10} />
              {status}
            </div>
          </div>
        </div>
        
        {meta.repo_url && (
          <a 
            href={meta.repo_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-purple-500 hover:bg-purple-50 p-2 rounded-full transition-all"
            title="Buka Repository/Link"
          >
            <ExternalLink size={18} />
          </a>
        )}
      </div>

      <p className="text-slate-500 text-sm line-clamp-2 z-10 min-h-[40px]">
        {description}
      </p>

      {/* Grid for Extra Info */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 border-dashed z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <User size={10} /> Klien
          </span>
          <span className="text-xs font-medium text-slate-700 truncate" title={clientName}>{clientName}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Clock size={10} /> Estimasi
          </span>
          <span className="text-xs font-medium text-slate-700 truncate" title={timeEstimate}>{timeEstimate}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <DollarSign size={10} /> Budget
          </span>
          <span className="text-xs font-medium text-slate-700 truncate" title={budget}>{budget}</span>
        </div>
      </div>

      <div className="z-10">
        <div className="flex flex-wrap gap-1.5">
          {techStack.length > 0 ? (
            techStack.slice(0, 4).map((tech, i) => (
              <span key={i} className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200/50">
                {tech}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">Belum ada tech stack</span>
          )}
          {techStack.length > 4 && (
            <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-600 rounded-lg border border-purple-100">
              +{techStack.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
