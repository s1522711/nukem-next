'use client'

import { useState, useEffect } from 'react'
import { processCheckout } from '@/app/actions/checkout'
import { useCart } from './CartProvider'
import { SubmitButton } from './SubmitButton'
import { useRouter } from 'next/navigation'

export function CheckoutPaymentForm() {
  const router = useRouter()
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)
  const [billingData, setBillingData] = useState<any>(null)
  
  // Credit Card State
  const [ccNumber, setCcNumber] = useState('')
  const [ccExp, setCcExp] = useState('')
  const [cardType, setCardType] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('nukem_billing')
    if (stored) {
      try {
        setBillingData(JSON.parse(stored))
      } catch (e) {
        console.error(e)
      }
    } else {
      // If they skipped the first step, kick them back
      router.push('/checkout')
    }
    setMounted(true)
  }, [router])

  const handleCcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    
    // Detect Card Type
    let type = null
    if (val.startsWith('4')) type = 'Visa'
    else if (/^5[1-5]/.test(val)) type = 'Mastercard'
    else if (/^3[47]/.test(val)) type = 'Amex'
    else if (/^6(?:011|5)/.test(val)) type = 'Discover'
    setCardType(type)

    // Format (Amex is 4-6-5, others 4-4-4-4)
    if (type === 'Amex') {
      val = val.substring(0, 15)
      const parts = []
      if (val.length > 0) parts.push(val.substring(0, 4))
      if (val.length > 4) parts.push(val.substring(4, 10))
      if (val.length > 10) parts.push(val.substring(10, 15))
      setCcNumber(parts.join(' '))
    } else {
      val = val.substring(0, 16)
      const parts = []
      for (let i = 0; i < val.length; i += 4) {
        parts.push(val.substring(i, i + 4))
      }
      setCcNumber(parts.join(' '))
    }
  }

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4)
    if (val.length >= 3) {
      val = val.substring(0, 2) + ' / ' + val.substring(2, 4)
    }
    setCcExp(val)
  }

  if (!mounted || !billingData) return null

  return (
    <div className="bg-obsidian-light/50 border border-obsidian-border p-8 tactical-border backdrop-blur-md">
      <form action={processCheckout} className="space-y-6">
        {/* Hidden inputs to pass state to server action */}
        <input type="hidden" name="cartItems" value={JSON.stringify(items)} />
        <input type="hidden" name="firstName" value={billingData.firstName} />
        <input type="hidden" name="lastName" value={billingData.lastName} />
        <input type="hidden" name="email" value={billingData.email} />
        <input type="hidden" name="country" value={billingData.country} />
        <input type="hidden" name="address" value={billingData.address} />
        <input type="hidden" name="zip" value={billingData.zip} />
        <input type="hidden" name="paymentMethod" value={billingData.paymentMethod} />

        {billingData.paymentMethod === 'credit_card' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-cyan-glow animate-pulse-fast"></span>
              <h3 className="text-xl font-bold text-slate-100 tracking-widest uppercase">Credit Card Details</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Cardholder Designation</label>
              <input name="cc-name" required className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest flex justify-between">
                <span>Authorization Sequence</span>
                {cardType && <span className="text-cyan-glow font-mono bg-cyan-glow/10 px-2 rounded-sm border border-cyan-glow/50">{cardType}</span>}
              </label>
              <input 
                name="cc-number" 
                required 
                value={ccNumber}
                onChange={handleCcChange}
                placeholder="XXXX XXXX XXXX XXXX"
                className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Valid Thru</label>
                <input 
                  name="cc-expiration" 
                  required 
                  value={ccExp}
                  onChange={handleExpChange}
                  placeholder="MM / YY" 
                  className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Security Code</label>
                <input name="cc-cvv" required maxLength={4} className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" />
              </div>
            </div>
          </div>
        )}

        {billingData.paymentMethod === 'crypto' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-crimson animate-pulse-fast box-shadow-crimson"></span>
              <h3 className="text-xl font-bold text-slate-100 tracking-widest uppercase text-shadow-crimson">Nukecoin Transfer</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="bg-white p-2 border border-crimson box-shadow-crimson mb-2 inline-block">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    alt="Nukecoin QR Code"
                    className="w-[150px] h-[150px]"
                  />
                </div>
                <div className="text-[10px] text-crimson font-mono tracking-widest uppercase text-center">
                  SCAN TO INITIATE<br/>TRANSFER SEQUENCE
                </div>
              </div>

              <div className="w-full md:w-2/3 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Origin Wallet Address</label>
                  <input name="crypto-wallet" required placeholder="0x..." className="w-full bg-obsidian border border-crimson/50 rounded-none px-4 py-3 text-crimson font-mono focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson transition-colors box-shadow-crimson" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Transaction Hash</label>
                  <input name="crypto-tx" required placeholder="Paste TX ID here..." className="w-full bg-obsidian border border-crimson/50 rounded-none px-4 py-3 text-crimson font-mono focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson transition-colors box-shadow-crimson" />
                </div>
              </div>
            </div>
          </div>
        )}

        <SubmitButton 
          loadingText="Authorizing Transfer..." 
          className={`w-full mt-8 py-4 tactical-border font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
            billingData.paymentMethod === 'crypto' 
              ? 'bg-crimson/10 border border-crimson text-crimson hover:bg-crimson hover:text-obsidian hover:box-shadow-crimson'
              : 'bg-cyan-glow/10 border border-cyan-glow text-cyan-glow hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan'
          }`}
        >
          Authorize Transfer
        </SubmitButton>
      </form>
    </div>
  )
}
