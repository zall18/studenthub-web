'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { LogIn } from 'lucide-react'

export default function LoginButton() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="flex items-center gap-2 bg-[#FF9F43] hover:bg-[#ff8f24] text-white px-6 py-3 rounded-full font-bold text-lg transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <LogIn size={20} />
      {loading ? 'Menghubungkan...' : 'Mulai dengan Google'}
    </button>
  )
}
