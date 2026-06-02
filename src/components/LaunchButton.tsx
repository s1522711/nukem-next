'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LaunchButton({ href }: { href: string }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleLaunch = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 1000))
    router.push(href)
  }

  return (
    <button 
      onClick={handleLaunch}
      disabled={isProcessing}
      className="relative inline-flex items-center justify-center h-10 w-44 bg-crimson/20 border border-crimson text-crimson font-bold uppercase tracking-[0.2em] hover:bg-crimson hover:text-obsidian hover:box-shadow-crimson transition-colors duration-300 text-xs shrink-0 disabled:opacity-50 overflow-hidden"
    >
      <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${isProcessing ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <span className="w-2 h-2 bg-crimson animate-pulse shrink-0"></span>
        <span>LAUNCH</span>
      </div>
      
      <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${isProcessing ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
        <span>AUTHORIZING</span>
      </div>
    </button>
  )
}
