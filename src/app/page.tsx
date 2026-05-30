import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const COLOR_CLASSES = [
  { value: 'bg-blue-500', hex: '#3b82f6' },
  { value: 'bg-red-500', hex: '#ef4444' },
  { value: 'bg-green-500', hex: '#22c55e' },
  { value: 'bg-yellow-500', hex: '#eab308' },
  { value: 'bg-purple-500', hex: '#a855f7' },
  { value: 'bg-pink-500', hex: '#ec4899' },
  { value: 'bg-gray-500', hex: '#6b7280' },
  { value: 'bg-white', hex: '#ffffff' },
  { value: 'bg-black', hex: '#000000' },
]

const TEXT_COLOR_CLASSES = [
  { value: 'text-white', hex: '#ffffff' },
  { value: 'text-black', hex: '#000000' },
  { value: 'text-blue-500', hex: '#3b82f6' },
  { value: 'text-red-500', hex: '#ef4444' },
]

export default async function Home() {
  const items = await prisma.item.findMany()

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-40 flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-obsidian-border">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-obsidian"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-px bg-cyan-glow"></span>
            <span className="text-cyan-glow tracking-[0.3em] text-xs sm:text-sm font-bold">SYSTEM ONLINE</span>
            <span className="w-12 h-px bg-cyan-glow"></span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-[0.1em] text-slate-100 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] text-center break-words max-w-[90vw]">
            NUKEM<span className="text-cyan-glow text-shadow-cyan">_COMMAND</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 mb-10 max-w-2xl font-sans font-light tracking-wide px-4">
            Global Armaments & Tactical Ordnance Logistics Network.
          </p>
          <a href="#database" className="tactical-border bg-cyan-glow/10 border border-cyan-glow text-cyan-glow font-bold px-10 py-4 hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan transition-all duration-300 tracking-[0.2em]">
            INITIALIZE DATABASE
          </a>
        </div>
      </section>

      {/* Products Grid */}
      <section id="database" className="py-24 px-4 container mx-auto max-w-7xl relative">
        <div className="mb-12 flex items-center justify-between border-b border-obsidian-border pb-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-crimson animate-pulse-fast box-shadow-crimson"></div>
            <h2 className="text-2xl font-bold text-slate-200 tracking-[0.15em]">AVAILABLE_ASSETS</h2>
          </div>
          <div className="text-sm text-cyan-glow tracking-widest hidden md:block">
            ENTRIES: {items.length} // STATUS: SECURE
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.id} className="group bg-obsidian-light/50 border border-obsidian-border overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 flex flex-col relative tactical-border-sm hover:box-shadow-cyan">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-glow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative h-64 w-full overflow-hidden bg-obsidian-border/50 p-1 border-b border-obsidian-border">
                <img 
                  src={item.imageLocation || ''} 
                  alt={item.itemName}
                  className="w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-cyan-glow/5 mix-blend-overlay group-hover:bg-transparent transition-colors"></div>
                
                {item.flairText && (
                  <div className="absolute top-3 right-3 z-10">
                    {item.flairLink && item.flairLink !== '#' && item.flairLink !== 'n/a' ? (
                      <Link href={item.flairLink} className="block">
                        <span className={`px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase border border-cyan-glow/50 ${item.flairColorClass} ${item.flairTextColorClass}`}
                              style={{
                                backgroundColor: COLOR_CLASSES.find(c => c.value === item.flairColorClass)?.hex || '#3b82f6',
                                color: TEXT_COLOR_CLASSES.find(c => c.value === item.flairTextColorClass)?.hex || '#ffffff'
                              }}>
                          [{item.flairText}]
                        </span>
                      </Link>
                    ) : (
                      <span className={`px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase border border-cyan-glow/50 ${item.flairColorClass} ${item.flairTextColorClass}`}
                            style={{
                              backgroundColor: COLOR_CLASSES.find(c => c.value === item.flairColorClass)?.hex || '#3b82f6',
                              color: TEXT_COLOR_CLASSES.find(c => c.value === item.flairTextColorClass)?.hex || '#ffffff'
                            }}>
                        [{item.flairText}]
                      </span>
                    )}
                  </div>
                )}
                
                <div className="absolute bottom-2 left-3 z-10">
                  <span className="text-[10px] text-cyan-glow/70 tracking-widest font-mono">ID: {item.itemCode}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col relative z-20 bg-obsidian-light/80">
                <h3 className="text-xl font-bold text-slate-100 mb-2 tracking-wide uppercase">
                  {item.itemName}
                </h3>
                <div className="text-2xl text-cyan-glow mb-8 font-bold tracking-wider">
                  ${item.price.toLocaleString()}
                </div>
                
                <div className="mt-auto">
                  <Link 
                    href={`/productPage?itemCode=${item.itemCode}`}
                    className="flex items-center justify-center w-full py-3 bg-obsidian-border text-cyan-glow text-sm font-bold tracking-[0.2em] border border-obsidian-border hover:border-cyan-glow hover:bg-cyan-glow/10 transition-all duration-300 tactical-border-sm"
                  >
                    ACCESS_DATA
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
