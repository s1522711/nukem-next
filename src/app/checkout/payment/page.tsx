import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { CheckoutPaymentForm } from '@/components/CheckoutPaymentForm'

export default async function CheckoutPaymentPage({ searchParams }: { searchParams: { error?: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const sp = await searchParams
  const error = sp.error

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="flex items-center gap-4 mb-8 border-b border-obsidian-border pb-4">
        <div className="w-3 h-3 bg-crimson animate-pulse-fast box-shadow-crimson"></div>
        <h2 className="text-3xl font-bold text-slate-100 tracking-[0.15em] uppercase">Payment Authorization</h2>
      </div>
      
      {error && (
        <div className="mb-8 p-4 bg-crimson-dim border border-crimson text-crimson font-mono text-sm uppercase tracking-wider box-shadow-crimson">
          [TRANSFER_ERROR] {error}
        </div>
      )}

      <CheckoutPaymentForm />
    </div>
  )
}
