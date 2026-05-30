import { register } from '@/app/actions/auth'

export default async function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  const sp = await searchParams
  const error = sp.error

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md bg-obsidian-light/50 border border-obsidian-border p-8 tactical-border shadow-xl animate-fade-in relative z-10 backdrop-blur-md">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-obsidian-border pb-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-cyan-glow animate-pulse-fast box-shadow-cyan"></span>
            <h2 className="text-xl font-bold text-cyan-glow tracking-[0.2em] uppercase">Initialize Profile</h2>
          </div>
          <span className="text-xs font-mono text-cyan-glow/50">NEW_OPERATIVE</span>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-crimson-dim border border-crimson text-crimson font-mono text-sm uppercase tracking-wider box-shadow-crimson">
            [ERROR] {error}
          </div>
        )}

        <form action={register} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Requested ID</label>
            <input 
              name="username" 
              required 
              className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" 
              placeholder="Create operative ID..."
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Security Passcode</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" 
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Verify Passcode</label>
            <input 
              name="confirm-password" 
              type="password" 
              required 
              className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full mt-8 py-4 tactical-border-sm bg-cyan-glow/10 border border-cyan-glow text-cyan-glow font-bold uppercase tracking-[0.2em] hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan transition-all duration-300">
            Register Operative
          </button>
        </form>
      </div>
    </div>
  )
}
