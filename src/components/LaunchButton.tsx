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
    // Reset state after a short delay so the button isn't stuck if the user navigates back
    setTimeout(() => {
      setIsProcessing(false)
    }, 500)
  }

  return (
    <button 
      onClick={handleLaunch}
      disabled={isProcessing}
      style={{ width: '180px', height: '40px', overflow: 'hidden', flexShrink: 0 }}
      className="inline-flex items-center justify-center bg-crimson/20 border border-crimson text-crimson font-bold uppercase tracking-[0.2em] hover:bg-crimson hover:text-obsidian hover:box-shadow-crimson transition-colors duration-300 text-xs disabled:opacity-50"
    >
      {isProcessing ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
          <span>AUTHORIZING...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
          <span className="w-2 h-2 bg-crimson animate-pulse shrink-0"></span>
          <span>LAUNCH</span>
        </div>
      )}
    </button>
  )
}
