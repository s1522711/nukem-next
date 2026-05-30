import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function UserCpPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { orders: { orderBy: { createdAt: 'desc' } } }
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="flex items-center gap-4 mb-12 border-b-2 border-cyan-glow/50 pb-4">
        <div className="w-4 h-4 bg-cyan-glow animate-pulse-fast box-shadow-cyan tactical-border-sm"></div>
        <h1 className="text-3xl font-bold text-cyan-glow tracking-[0.2em] uppercase text-shadow-cyan">
          Operative Dossier: {user.username}
        </h1>
      </div>

      <div className="bg-obsidian-light/50 border border-obsidian-border p-8 tactical-border mb-12 relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-glow/5 blur-3xl rounded-full"></div>
        <h2 className="text-xl font-bold text-slate-200 mb-6 uppercase tracking-widest border-b border-cyan-glow/20 pb-2">Classification Details</h2>
        <div className="space-y-4 font-mono text-sm">
          <p className="flex items-center gap-4 border-b border-obsidian-border pb-2">
            <span className="text-cyan-glow w-24">SYS_ID:</span> 
            <span className="text-slate-300">{user.id}</span>
          </p>
          <p className="flex items-center gap-4 border-b border-obsidian-border pb-2">
            <span className="text-cyan-glow w-24">CLEARANCE:</span> 
            <span className={`px-2 py-1 text-[10px] uppercase border ${user.admin ? 'bg-crimson/10 text-crimson border-crimson/50' : 'bg-obsidian border-cyan-glow/30 text-cyan-glow'}`}>
              {user.admin ? 'Level_4_Command' : 'Level_1_Standard'}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-obsidian-light/50 border border-obsidian-border p-8 tactical-border backdrop-blur-md">
        <h2 className="text-xl font-bold text-slate-200 mb-6 uppercase tracking-widest border-b border-cyan-glow/20 pb-2">Procurement History</h2>
        
        {user.orders.length === 0 ? (
          <p className="text-cyan-glow/50 font-mono italic">[NO_RECORDS_FOUND]</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead className="text-xs uppercase text-cyan-glow border-b border-cyan-glow/30">
                <tr>
                  <th className="px-4 py-3">Tx_ID</th>
                  <th className="px-4 py-3">Asset Designation</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Intel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-border text-slate-300">
                {user.orders.map(order => (
                  <tr key={order.id} className="hover:bg-cyan-glow/5 transition-colors group">
                    <td className="px-4 py-4 text-cyan-glow/50">#{order.id}</td>
                    <td className="px-4 py-4 font-bold group-hover:text-cyan-glow transition-colors">{order.itemName}</td>
                    <td className="px-4 py-4">${order.price.toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-500">{order.createdAt.toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <Link href={`/checkout/confirmed?orderId=${order.id}`} className="text-cyan-glow hover:text-white text-xs uppercase tracking-widest hover:text-shadow-cyan transition-colors">
                        [ACCESS_LOG]
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
