'use client'

import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import OrganizationCard, { Organization } from './OrganizationCard'
import AddOrganizationModal from './AddOrganizationModal'

export default function OrganisasiList({ organizations }: { organizations: Organization[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800 flex items-center gap-3">
            <Users size={28} className="text-[#FF9F43]" />
            Daftar Organisasi
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Organisasi yang sedang atau pernah Anda ikuti
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors border border-slate-200"
        >
          <Plus size={18} />
          Tambah Organisasi
        </button>
      </div>

      {organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
          <div className="bg-slate-100 p-4 rounded-full mb-4">
            <Users size={32} className="text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-700 mb-1">Belum Ada Organisasi</h3>
          <p className="text-slate-500 text-sm max-w-sm mb-6">
            Anda belum menambahkan data organisasi. Tambahkan sekarang untuk mulai melacak tugas dan peran Anda.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FF9F43] hover:bg-[#FF7B00] text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-[#FF9F43]/30"
          >
            <Plus size={18} />
            Tambah Organisasi
          </button>
        </div>
      )}

      {isModalOpen && (
        <AddOrganizationModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
