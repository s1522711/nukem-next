'use client'

import { setTheme } from '@/app/actions/theme'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function ThemeToggle({ currentTheme }: { currentTheme: 'modern' | 'classic' }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const toggleTheme = () => {
    startTransition(async () => {
      await setTheme(currentTheme === 'modern' ? 'classic' : 'modern')
      router.refresh()
    })
  }

  if (currentTheme === 'classic') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          disabled={isPending}
          className="btn btn-secondary shadow"
          style={{ backgroundColor: '#6c757d', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
        >
          {isPending ? 'Switching...' : 'Switch to Modern UI'}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleTheme}
        disabled={isPending}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-md bg-opacity-80 border border-white/20"
      >
        {isPending ? 'Switching...' : 'Switch to Classic UI'}
      </button>
    </div>
  )
}
