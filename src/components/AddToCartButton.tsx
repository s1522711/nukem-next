'use client'

import React, { useState } from 'react'
import { useCart, CartItem } from './CartProvider'

export function AddToCartButton({ item }: { item: CartItem }) {
  const { addToCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAdd = async () => {
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 600))
    addToCart(item)
    setIsProcessing(false)
  }

  return (
    <button 
      onClick={handleAdd}
      disabled={isProcessing}
      className="relative flex items-center justify-center w-full h-16 text-xl font-bold tracking-[0.3em] uppercase text-obsidian bg-cyan-glow hover:bg-white transition-colors duration-300 tactical-border box-shadow-cyan disabled:opacity-50 overflow-hidden"
    >
      <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isProcessing ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        ADD TO MANIFEST
      </div>
      <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-transform duration-300 ${isProcessing ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
        <span>PROCESSING</span>
      </div>
    </button>
  )
}
