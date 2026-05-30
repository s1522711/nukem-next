import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { MissileSim } from '@/components/MissileSim'

export default async function LaunchControlPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const sp = await searchParams
  const orderId = parseInt(sp.orderId || '0', 10)
  if (!orderId) redirect('/')

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) redirect('/')

  if (order.userId !== session.userId && !session.admin) {
    redirect('/')
  }

  // Double check it's actually high-yield ordnance
  const item = await prisma.item.findFirst({ where: { itemName: order.itemName } })
  if (!item || (item.itemCode !== 'TsarBomba' && item.itemCode !== 'LittleBoy')) {
    redirect(`/checkout/confirmed?orderId=${order.id}`)
  }

  return (
    <div className="min-h-screen bg-obsidian flex flex-col relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col flex-grow">
        
        <div className="flex flex-col items-center justify-center text-center mb-8 animate-fade-in border-b border-crimson/30 pb-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="w-12 h-px bg-crimson"></span>
            <span className="text-crimson tracking-[0.3em] text-sm font-bold uppercase animate-pulse">STRATEGIC LAUNCH CONTROL</span>
            <span className="w-12 h-px bg-crimson"></span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.1em] text-slate-100 mb-2 drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]">
            AWAITING <span className="text-crimson text-shadow-crimson">COORDINATES</span>
          </h1>
          <p className="text-slate-400 font-mono text-sm tracking-widest max-w-2xl mt-4 bg-crimson/10 border border-crimson/30 px-4 py-2">
            WARNING: YOU HAVE AUTHORIZED A STRATEGIC STRIKE USING [{order.itemName}]. SELECT A TARGET DESIGNATION ON THE TACTICAL GRID TO INITIATE DEPLOYMENT.
          </p>
        </div>

        <div className="flex-grow flex flex-col border border-cyan-glow/30 bg-obsidian-light/50 tactical-border p-1 md:p-4 box-shadow-cyan relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none"></div>
          
          <MissileSim orderId={order.id} itemName={order.itemName} />
          
        </div>

      </div>
    </div>
  )
}
