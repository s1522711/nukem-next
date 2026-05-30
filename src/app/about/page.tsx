export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl relative">
      
      <div className="flex items-center gap-4 mb-16 border-b border-obsidian-border pb-6 justify-center">
        <span className="w-16 h-px bg-cyan-glow"></span>
        <h1 className="text-4xl font-bold text-cyan-glow tracking-[0.3em] uppercase text-shadow-cyan text-center">
          INTEL // BRIEFING
        </h1>
        <span className="w-16 h-px bg-cyan-glow"></span>
      </div>

      <div className="bg-obsidian-light/50 border border-cyan-glow/30 p-12 tactical-border relative backdrop-blur-md">
        <div className="absolute top-0 left-0 w-2 h-full bg-cyan-glow box-shadow-cyan"></div>
        <div className="absolute top-6 right-6 opacity-20 text-cyan-glow select-none">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5"/>
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2"/>
            <path d="M50 0L50 100M0 50L100 50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5"/>
          </svg>
        </div>

        <div className="relative z-10 font-mono space-y-8">
          <p className="text-xl text-slate-200 leading-relaxed uppercase tracking-widest border-l border-cyan-glow/20 pl-6 py-2">
            Welcome to NUKEM_COMMAND, your premier logistics network for high-end ordnance, historic munitions, and next-generation rocketry.
          </p>
          
          <div className="w-full h-px bg-obsidian-border my-8"></div>
          
          <p className="text-lg text-slate-400 leading-relaxed">
            [SYS_LOG]: Founded on the tactical principles of ultimate firepower and absolute superiority, we facilitate secure transfers for discerning commands requiring massive impact.
          </p>
          
          <p className="text-lg text-slate-400 leading-relaxed">
            [DATABASE_ENTRY]: From the classic <span className="text-cyan-glow font-bold">TSAR_BOMBA</span> architecture to the modern <span className="text-cyan-glow font-bold">TAMIR_GTA_MISSILE</span> systems, our asset repository remains unmatched in global logistics.
          </p>
        </div>
      </div>
    </div>
  )
}
