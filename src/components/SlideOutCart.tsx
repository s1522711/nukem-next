'use client'

import React, { useState } from 'react'
import { useCart } from './CartProvider'
import Link from 'next/link'

export function SlideOutCart() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, subtotal, shippingFee } = useCart()
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  const handleRemove = async (itemCode: string) => {
    setProcessingAction(`remove-${itemCode}`)
    await new Promise(r => setTimeout(r, 400))
    removeFromCart(itemCode)
    setProcessingAction(null)
  }

  const handleUpdate = async (itemCode: string, newQty: number) => {
    setProcessingAction(`update-${itemCode}`)
    await new Promise(r => setTimeout(r, 400))
    updateQuantity(itemCode, newQty)
    setProcessingAction(null)
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      ></div>
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-obsidian-light border-l border-cyan-glow/50 z-50 transition-transform duration-500 ease-in-out flex flex-col shadow-[-10px_0_30px_rgba(0,240,255,0.1)] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ transform: isCartOpen ? 'translateX(0)' : 'translateX(120%)' }}
      >
        
        <div className="flex items-center justify-between p-6 border-b border-obsidian-border bg-obsidian">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-cyan-glow box-shadow-cyan animate-pulse"></span>
            <h2 className="text-xl font-bold text-slate-100 tracking-widest uppercase">Cart Manifest</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-slate-500 hover:text-crimson transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-slate-500 font-mono mt-10">
              <p className="uppercase tracking-widest mb-2">[ EMPTY ]</p>
              <p className="text-xs">NO ASSETS SELECTED FOR ACQUISITION.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.itemCode} className="flex gap-4 p-4 bg-obsidian-border/20 border border-obsidian-border tactical-border-sm relative group">
                <div className="w-20 h-20 bg-obsidian flex-shrink-0 relative overflow-hidden border border-cyan-glow/30">
                  {item.imageLocation ? (
                    <img src={item.imageLocation} alt={item.itemName} className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-cyan-glow/50 font-mono">NO_IMG</div>
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider leading-tight pr-4">{item.itemName}</h3>
                    <button 
                      onClick={() => handleRemove(item.itemCode)}
                      disabled={processingAction === `remove-${item.itemCode}`}
                      className="text-slate-500 hover:text-crimson disabled:opacity-50"
                    >
                      {processingAction === `remove-${item.itemCode}` ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></span>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="text-cyan-glow font-bold tracking-widest">${item.price.toLocaleString()}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => handleUpdate(item.itemCode, item.quantity - 1)}
                      disabled={processingAction === `update-${item.itemCode}`}
                      className="w-6 h-6 flex items-center justify-center bg-obsidian border border-obsidian-border text-slate-400 hover:text-cyan-glow hover:border-cyan-glow transition-colors disabled:opacity-50"
                    >
                      {processingAction === `update-${item.itemCode}` ? (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      ) : '-'}
                    </button>
                    <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdate(item.itemCode, item.quantity + 1)}
                      disabled={processingAction === `update-${item.itemCode}`}
                      className="w-6 h-6 flex items-center justify-center bg-obsidian border border-obsidian-border text-slate-400 hover:text-cyan-glow hover:border-cyan-glow transition-colors disabled:opacity-50"
                    >
                      {processingAction === `update-${item.itemCode}` ? (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      ) : '+'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-obsidian border-t border-obsidian-border">
          <div className="space-y-2 mb-4 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Logistics (Shipping)</span>
              <span className="text-cyan-glow">${shippingFee.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6 pt-4 border-t border-cyan-glow/20">
            <span className="text-slate-400 font-mono text-sm uppercase tracking-widest">Total Valuation</span>
            <span className="text-2xl font-bold text-cyan-glow drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-4 flex-col">
            <Link 
              href="/cart"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-3 text-center text-xs font-bold text-slate-300 uppercase tracking-[0.2em] border border-obsidian-border hover:border-cyan-glow hover:text-cyan-glow transition-colors"
            >
              View Full Manifest
            </Link>
            <Link 
              href="/checkout"
              onClick={(e) => {
                if (items.length === 0) e.preventDefault();
                else setIsCartOpen(false);
              }}
              className={`w-full py-4 text-center text-sm font-bold uppercase tracking-[0.3em] tactical-border transition-all duration-300 ${
                items.length > 0 
                  ? 'bg-cyan-glow/10 border-cyan-glow text-cyan-glow hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan cursor-pointer' 
                  : 'bg-obsidian-border/50 border-obsidian-border text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
