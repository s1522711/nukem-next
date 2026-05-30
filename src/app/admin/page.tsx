import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { deleteUser, toggleAdmin } from '@/app/actions/admin'

import { AdminItemsManager } from '@/components/AdminItemsManager'
import { AdminUserActions } from '@/components/AdminUserActions'

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session || !session.admin) {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    select: { id: true, username: true, admin: true }
  })
  
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  const items = await prisma.item.findMany()

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="flex items-center gap-4 mb-12 border-b-2 border-crimson/50 pb-4">
        <div className="w-4 h-4 bg-crimson animate-pulse-fast box-shadow-crimson tactical-border-sm"></div>
        <h1 className="text-3xl font-bold text-crimson tracking-[0.2em] uppercase text-shadow-crimson">
          Command Center Level 4
        </h1>
      </div>

      <div className="space-y-16">
        {/* Users Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-cyan-glow box-shadow-cyan"></span>
            <h2 className="text-xl font-bold text-slate-200 tracking-widest uppercase">Operatives Roster</h2>
          </div>
          <div className="bg-obsidian-light/50 border border-obsidian-border overflow-hidden overflow-x-auto tactical-border-sm">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-obsidian-border/50 text-cyan-glow text-xs tracking-widest uppercase font-mono border-b border-cyan-glow/20">
                <tr>
                  <th className="px-6 py-4">ID_Code</th>
                  <th className="px-6 py-4">Callsign</th>
                  <th className="px-6 py-4">Clearance</th>
                  <th className="px-6 py-4 text-right">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-border text-slate-300 font-mono text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-cyan-glow/5 transition-colors group">
                    <td className="px-6 py-4 text-cyan-glow/50">{u.id}</td>
                    <td className="px-6 py-4 font-bold group-hover:text-cyan-glow transition-colors">{u.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] tracking-widest uppercase border ${u.admin ? 'bg-crimson/10 text-crimson border-crimson/50 box-shadow-crimson' : 'bg-obsidian text-slate-400 border-obsidian-border'}`}>
                        {u.admin ? 'Lvl_4_Admin' : 'Lvl_1_User'}
                      </span>
                    </td>
                    <AdminUserActions user={u} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Items Section */}
        <section>
          <AdminItemsManager items={items} />
        </section>

        {/* Orders Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-cyan-glow box-shadow-cyan"></span>
            <h2 className="text-xl font-bold text-slate-200 tracking-widest uppercase">Transfer Logs</h2>
          </div>
          <div className="bg-obsidian-light/50 border border-obsidian-border overflow-hidden overflow-x-auto tactical-border-sm">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-obsidian-border/50 text-cyan-glow text-xs tracking-widest uppercase font-mono border-b border-cyan-glow/20">
                <tr>
                  <th className="px-6 py-4">Tx_ID</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Operative</th>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Sector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-border text-slate-300 font-mono text-sm">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-cyan-glow/5 transition-colors">
                    <td className="px-6 py-4 text-cyan-glow/50">#{o.id}</td>
                    <td className="px-6 py-4 text-slate-400">{o.createdAt.toLocaleDateString()}</td>
                    <td className="px-6 py-4 uppercase">{o.name}</td>
                    <td className="px-6 py-4 font-bold text-cyan-glow">{o.itemName}</td>
                    <td className="px-6 py-4">${o.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-400">{o.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
