'use client'

import React from 'react'
import { useCart } from '@/components/CartProvider'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, subtotal, shippingFee } = useCart()

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="flex items-center gap-4 mb-8 border-b border-obsidian-border pb-4">
        <div className="w-3 h-3 bg-cyan-glow animate-pulse-fast box-shadow-cyan"></div>
        <h2 className="text-3xl font-bold text-slate-100 tracking-[0.15em] uppercase">Acquisition Manifest</h2>
      </div>

      {items.length === 0 ? (
        <div className="bg-obsidian-light/50 border border-obsidian-border p-12 text-center tactical-border backdrop-blur-md">
          <h3 className="text-xl font-bold text-slate-400 mb-4 tracking-widest uppercase">NO ASSETS SELECTED</h3>
          <p className="text-slate-500 font-mono mb-8">Return to the database to designate items for acquisition.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-3 py-4 px-8 tactical-border bg-cyan-glow/10 border border-cyan-glow text-cyan-glow font-bold uppercase tracking-[0.2em] hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan transition-all duration-300"
          >
            Access Database
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.itemCode} className="flex flex-col sm:flex-row gap-6 p-6 bg-obsidian-light/50 border border-obsidian-border tactical-border-sm relative group">
                <div className="w-full sm:w-32 h-32 bg-obsidian flex-shrink-0 relative overflow-hidden border border-cyan-glow/30">
                  {item.imageLocation ? (
                    <img src={item.imageLocation} alt={item.itemName} className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-cyan-glow/50 font-mono">NO_IMG</div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 uppercase tracking-wider mb-1">{item.itemName}</h3>
                      <div className="text-xs text-slate-500 font-mono">ID: {item.itemCode}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.itemCode)}
                      className="text-slate-500 hover:text-crimson transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">QTY</span>
                      <button 
                        onClick={() => updateQuantity(item.itemCode, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-obsidian border border-obsidian-border text-slate-400 hover:text-cyan-glow hover:border-cyan-glow transition-colors font-mono"
                      >-</button>
                      <span className="font-mono text-lg w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.itemCode, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-obsidian border border-obsidian-border text-slate-400 hover:text-cyan-glow hover:border-cyan-glow transition-colors font-mono"
                      >+</button>
                    </div>
                    <div className="text-xl font-bold text-cyan-glow tracking-widest">
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-obsidian-light/50 border border-obsidian-border p-6 sticky top-24 tactical-border backdrop-blur-md">
              <h3 className="text-lg font-bold text-cyan-glow mb-6 tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-glow"></span>
                Logistics Summary
              </h3>
              
              <div className="space-y-4 mb-6 text-sm font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Logistics/Transport</span>
                  <span className="text-cyan-glow">${shippingFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-cyan-glow/20 pt-4 mt-4 flex justify-between items-center text-lg font-bold text-slate-100 uppercase tracking-widest mb-8">
                <span>Total</span>
                <span className="text-cyan-glow drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>

              <Link 
                href="/checkout"
                className="block w-full py-4 text-center tactical-border bg-cyan-glow/10 border border-cyan-glow text-cyan-glow font-bold uppercase tracking-[0.2em] hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan transition-all duration-300"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
