'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({ 
  children, 
  className, 
  loadingText = 'PROCESSING...' 
}: { 
  children: React.ReactNode
  className?: string
  loadingText?: string 
}) {
  const { pending } = useFormStatus()

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className={`${className} disabled:opacity-50`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          {loadingText}
        </span>
      ) : children}
    </button>
  )
}
