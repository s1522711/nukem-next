'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { deleteItem } from '@/app/actions/admin'

export function AdminItemActions({ item }: { item: { id: number, itemName: string } }) {
  const [confirmAction, setConfirmAction] = useState<'purge' | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleDeleteClick = () => {
    setConfirmAction('purge')
  }

  const executeAction = async () => {
    if (!confirmAction) return
    setIsProcessing(true)

    const formData = new FormData()
    formData.append('itemId', item.id.toString())

    try {
      if (confirmAction === 'purge') {
        await deleteItem(formData)
        setSuccessMsg('Task successful: Asset purged permanently.')
      }
    } catch (e) {
      console.error(e)
    }

    setConfirmAction(null)
    setIsProcessing(false)
  }

  return (
    <>
      <td className="px-6 py-4 text-right">
        <button 
          onClick={handleDeleteClick} 
          className="text-crimson hover:text-white px-3 py-1 border border-crimson/30 hover:bg-crimson/20 hover:border-crimson text-[10px] uppercase tracking-widest transition-all"
        >
          Purge
        </button>
      </td>

      {/* Confirmation Modal */}
      {mounted && createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300 ${confirmAction ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className={`bg-obsidian border border-cyan-glow/50 p-6 max-w-md w-full tactical-border box-shadow-cyan relative transform transition-all duration-300 ${confirmAction ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
            
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-glow"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-glow"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-glow"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-glow"></div>

            <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-crimson">
              Confirm Purge Directive
            </h3>
            
            <p className="text-slate-300 mb-8 font-mono text-sm leading-relaxed">
              Are you sure you want to <span className="font-bold text-white">purge</span> asset: {item.itemName}? This action will be logged in the mainframe and cannot be reversed.
            </p>
            
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setConfirmAction(null)} 
                disabled={isProcessing}
                className="px-4 py-2 border border-slate-600 text-slate-400 hover:text-white hover:border-white hover:bg-slate-800 uppercase tracking-widest text-xs transition-all disabled:opacity-50"
              >
                Abort
              </button>
              <button 
                onClick={executeAction} 
                disabled={isProcessing}
                className="px-4 py-2 border uppercase tracking-widest text-xs transition-all flex items-center gap-2 disabled:opacity-50 border-crimson text-crimson hover:bg-crimson/20"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : 'Execute'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Success Modal */}
      {mounted && createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300 ${successMsg ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className={`bg-obsidian border border-green-500/50 p-6 max-w-md w-full tactical-border shadow-[0_0_15px_rgba(34,197,94,0.2)] relative transform transition-all duration-300 ${successMsg ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Directive Complete
            </h3>
            <p className="text-slate-300 mb-8 font-mono text-sm">
              {successMsg}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setSuccessMsg(null)}
                className="px-6 py-2 border border-green-500/50 text-green-400 hover:bg-green-500/20 uppercase tracking-widest text-xs transition-all"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
