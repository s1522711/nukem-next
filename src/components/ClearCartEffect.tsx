'use client'

import { useEffect } from 'react'
import { useCart } from './CartProvider'

export function ClearCartEffect() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return null
}
