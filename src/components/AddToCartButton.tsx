'use client'

import React from 'react'
import { useCart, CartItem } from './CartProvider'

export function AddToCartButton({ item }: { item: CartItem }) {
  const { addToCart } = useCart()

  return (
    <button 
      onClick={() => addToCart(item)}
      className="inline-flex items-center justify-center w-full py-5 text-xl font-bold tracking-[0.3em] uppercase text-obsidian bg-cyan-glow hover:bg-white transition-all duration-300 tactical-border box-shadow-cyan"
    >
      ADD TO MANIFEST
    </button>
  )
}
