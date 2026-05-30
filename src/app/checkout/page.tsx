import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

import { CheckoutClientForm } from '@/components/CheckoutClientForm'

export default async function CheckoutPage({ searchParams }: { searchParams: { itemCode?: string, error?: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const sp = await searchParams
  const itemCode = sp.itemCode
  const error = sp.error
  if (!itemCode) redirect('/')

  const item = await prisma.item.findUnique({ where: { itemCode } })
  if (!item) redirect('/')

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="flex items-center gap-4 mb-8 border-b border-obsidian-border pb-4">
        <div className="w-3 h-3 bg-cyan-glow animate-pulse-fast box-shadow-cyan"></div>
        <h2 className="text-3xl font-bold text-slate-100 tracking-[0.15em] uppercase">Secure Transfer</h2>
      </div>
      
      {error && (
        <div className="mb-8 p-4 bg-crimson-dim border border-crimson text-crimson font-mono text-sm uppercase tracking-wider box-shadow-crimson">
          [TRANSFER_ERROR] {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <CheckoutClientForm itemCode={item.itemCode} />
        </div>

        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="bg-obsidian-light/50 border border-obsidian-border p-6 sticky top-24 tactical-border backdrop-blur-md">
            <h3 className="text-lg font-bold text-cyan-glow mb-6 tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-glow"></span>
              Manifest
            </h3>
            <div className="flex justify-between items-start mb-4 text-slate-300 font-mono text-sm">
              <span className="max-w-[150px]">{item.itemName}</span>
              <span className="text-cyan-glow">${item.price.toLocaleString()}</span>
            </div>
            <div className="border-t border-cyan-glow/20 pt-4 mt-4 flex justify-between items-center text-lg font-bold text-slate-100 uppercase tracking-widest">
              <span>Total</span>
              <span className="text-cyan-glow drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">${item.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
