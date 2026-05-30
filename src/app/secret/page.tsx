export default function SecretPage() {
  return (
    <div className="container mx-auto px-4 py-32 text-center relative overflow-hidden min-h-[70vh] flex flex-col items-center justify-center">
      
      {/* Red Alert Overlay */}
      <div className="absolute inset-0 bg-crimson/5 z-0 pointer-events-none animate-pulse-fast"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 mb-8 flex items-center justify-center border-2 border-crimson rounded-full box-shadow-crimson animate-pulse-fast">
          <span className="text-4xl">⚠</span>
        </div>
        
        <h1 className="text-5xl font-bold text-crimson mb-12 tracking-[0.3em] uppercase text-shadow-crimson">
          RESTRICTED_AREA
        </h1>
        
        <div className="max-w-3xl w-full mx-auto bg-obsidian-light/80 border-l-4 border-crimson p-12 tactical-border-sm text-left relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4 opacity-30">
            <span className="text-crimson font-mono text-[80px] font-bold leading-none">403</span>
          </div>

          <p className="text-2xl text-crimson font-mono mb-8 font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,42,42,0.8)]">
            CRITICAL: UNAUTHORIZED ACCESS ATTEMPT DETECTED
          </p>
          
          <div className="font-mono text-cyan-glow space-y-4 text-sm bg-obsidian/50 p-6 border border-cyan-glow/20">
            <p className="typing-effect animate-[pulse_2s_infinite]">] Initializing ICE defense protocols...</p>
            <p className="opacity-80">] Tracing originating proxy...</p>
            <p className="opacity-60">] Deploying active counter-measures...</p>
            <p className="text-crimson mt-4 pt-4 border-t border-crimson/30">] RECOMMEND IMMEDIATE DISCONNECT.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
