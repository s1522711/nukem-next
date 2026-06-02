import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ClearCartEffect } from '@/components/ClearCartEffect'
import { LaunchButton } from '@/components/LaunchButton'

export default async function CheckoutConfirmedPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const sp = await searchParams
  const orderId = parseInt(sp.orderId || '0', 10)
  if (!orderId) redirect('/')

  const order = await prisma.order.findUnique({ 
    where: { id: orderId },
    include: { items: true }
  })
  if (!order) redirect('/')

  if (order.userId !== session.userId && !session.admin) {
    redirect('/')
  }

  // Create a zero-padded order ID (e.g. 00045)
  const paddedOrderId = orderId.toString().padStart(5, '0')

  // Fetch items to check highYield status
  const itemCodes = order.items.map(i => i.itemCode)
  const realItems = await prisma.item.findMany({
    where: { itemCode: { in: itemCodes } }
  })
  
  const highYieldMap = new Map(realItems.map(i => [i.itemCode, i.highYield]))

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      <ClearCartEffect />
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-bold text-obsidian-border/20 z-0 select-none tracking-tighter whitespace-nowrap pointer-events-none">
        SECURED
      </div>

      <div className="w-full max-w-4xl bg-obsidian-light/80 border border-cyan-glow/50 p-8 md:p-12 tactical-border shadow-xl animate-fade-in relative z-10 box-shadow-cyan backdrop-blur-md">
        
        {/* Tactical Brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-glow hidden sm:block"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-glow hidden sm:block"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-glow hidden sm:block"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-glow hidden sm:block"></div>

        {/* Scanlines */}
        <div className="absolute inset-0 bg-cyan-glow/5 mix-blend-overlay z-0 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center text-center mb-10 border-b border-cyan-glow/30 pb-8">
            
            {/* Pulsing Target Icon */}
            <div className="relative w-20 h-20 flex items-center justify-center mb-6">
              <div className="absolute inset-0 border-2 border-cyan-glow rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-2 border border-cyan-glow/50 rounded-full animate-spin-slow"></div>
              <div className="w-2 h-2 bg-cyan-glow animate-pulse-fast box-shadow-cyan"></div>
              {/* Crosshair lines */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-glow/50"></div>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-cyan-glow/50"></div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-cyan-glow tracking-[0.2em] uppercase text-shadow-cyan mb-4">
              Transfer Secured
            </h2>
            <div className="text-slate-400 font-mono text-xs tracking-[0.3em] uppercase bg-cyan-glow/10 border border-cyan-glow/30 px-4 py-2 inline-block">
              LOGISTICS_UPLINK_ESTABLISHED
            </div>
          </div>

          <div className="bg-obsidian border border-obsidian-border p-6 mb-10 tactical-border-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-glow"></div>
            <div className="space-y-4 font-mono text-sm mb-6 border-b border-obsidian-border pb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-obsidian-border pb-4 gap-2">
                <span className="text-slate-500 tracking-widest uppercase text-xs">Tracking_ID</span>
                <span className="text-cyan-glow font-bold tracking-widest">NUK-ORD-{paddedOrderId}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-obsidian-border pb-4 gap-2">
                <span className="text-slate-500 tracking-widest uppercase text-xs">Total_Valuation</span>
                <span className="text-cyan-glow font-bold tracking-widest">${order.total.toLocaleString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-slate-500 tracking-widest uppercase text-xs">Current_Status</span>
                <span className="text-green-400 font-bold tracking-widest animate-pulse">PROCESSING_DEPLOYMENT</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-200 tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-200"></span> Asset Manifest
            </h3>
            
            <div className="space-y-4">
              {order.items.map(item => {
                const isHighYield = highYieldMap.get(item.itemCode)
                return (
                  <div key={item.id} className="bg-obsidian-light/50 border border-obsidian-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-bold uppercase tracking-wider">{item.quantity}x {item.itemName}</span>
                      <span className="text-cyan-glow/70 font-mono text-xs">ID: {item.itemCode} // ${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    {isHighYield && (
                      <LaunchButton href={`/checkout/launch?orderId=${order.id}&itemCode=${item.itemCode}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-3 py-4 px-10 tactical-border-sm bg-cyan-glow/10 border border-cyan-glow text-cyan-glow font-bold uppercase tracking-[0.3em] hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan transition-all duration-300 text-sm"
            >
              <span className="w-2 h-2 bg-cyan-glow box-shadow-cyan group-hover:bg-obsidian"></span>
              RETURN_TO_BASE
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
