'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  itemCode: string
  itemName: string
  price: number
  imageLocation: string | null
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemCode: string) => void
  updateQuantity: (itemCode: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('nukem-cart')
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nukem-cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addToCart = React.useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemCode === newItem.itemCode)
      if (existing) {
        return prev.map((i) =>
          i.itemCode === newItem.itemCode
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        )
      }
      return [...prev, newItem]
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = React.useCallback((itemCode: string) => {
    setItems((prev) => prev.filter((i) => i.itemCode !== itemCode))
  }, [])

  const updateQuantity = React.useCallback((itemCode: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemCode)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.itemCode === itemCode ? { ...i, quantity } : i))
    )
  }, [removeFromCart])

  const clearCart = React.useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
