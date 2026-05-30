import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

export default async function ProductPage({ searchParams }: { searchParams: { itemCode?: string } }) {
  const sp = await searchParams
  const itemCode = sp.itemCode

  if (!itemCode) {
    redirect('/')
  }

  const item = await prisma.item.findUnique({
    where: { itemCode },
  })

  if (!item) {
    redirect('/')
  }

  // Get random other items
  const allItems = await prisma.item.findMany({
    where: {
      itemCode: { not: itemCode },
    },
  })
  
  const shuffled = allItems.sort(() => 0.5 - Math.random())
  const suggestedItems = shuffled.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl animate-fade-in relative overflow-hidden md:overflow-visible">
      <div className="absolute top-0 right-10 text-[100px] md:text-[200px] font-bold text-obsidian-border/30 z-0 select-none tracking-tighter">
        {item.itemCode}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 relative z-10">
        <div className="relative overflow-hidden bg-obsidian-border/50 p-2 border border-cyan-glow/30 tactical-border box-shadow-cyan">
          <div className="absolute inset-0 bg-cyan-glow/10 mix-blend-overlay z-10 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-[10px] bg-cyan-glow/20 blur-md animate-scan z-20 pointer-events-none"></div>

          <img 
            src={item.imageLocation || ''} 
            alt={item.itemName} 
            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 filter contrast-125" 
          />
          
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-obsidian/80 text-cyan-glow font-mono text-xs px-2 py-1 border border-cyan-glow/50">
              TARGET_LOCKED // {item.itemCode}
            </span>
          </div>

          {item.flairText && (
            <div className="absolute top-4 right-4 z-20">
              {item.flairLink && item.flairLink !== '#' && item.flairLink !== 'n/a' ? (
                <Link href={item.flairLink} className="block">
                  <span 
                    className={`px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase border border-cyan-glow/50 ${item.flairColorClass} ${item.flairTextColorClass}`}
                    style={{
                      backgroundColor: COLOR_CLASSES.find(c => c.value === item.flairColorClass)?.hex || '#3b82f6',
                      color: TEXT_COLOR_CLASSES.find(c => c.value === item.flairTextColorClass)?.hex || '#ffffff'
                    }}
                  >
                    [{item.flairText}]
                  </span>
                </Link>
              ) : (
                <span 
                  className={`px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase border border-cyan-glow/50 ${item.flairColorClass} ${item.flairTextColorClass}`}
                  style={{
                    backgroundColor: COLOR_CLASSES.find(c => c.value === item.flairColorClass)?.hex || '#3b82f6',
                    color: TEXT_COLOR_CLASSES.find(c => c.value === item.flairTextColorClass)?.hex || '#ffffff'
                  }}
                >
                  [{item.flairText}]
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-px bg-cyan-glow"></span>
            <span className="text-cyan-glow text-xs uppercase tracking-widest font-mono">ASSET_DATA // SECURE</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-4 tracking-[0.1em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            {item.itemName}
          </h1>
          <div className="text-3xl font-bold text-cyan-glow mb-8 tracking-widest text-shadow-cyan">
            ${item.price.toLocaleString()}
          </div>
          
          <div className="mb-12 border-l-2 border-cyan-glow/50 pl-6 bg-cyan-glow/5 py-4">
            <p className="text-lg text-slate-300 font-mono leading-relaxed">
              Experience the ultimate destructive capability with the <span className="text-cyan-glow font-bold">{item.itemName}</span>. 
              Engineered for maximum impact and unparalleled performance in the field.
            </p>
          </div>
          
          <Link 
            href={`/checkout?itemCode=${item.itemCode}`}
            className="inline-flex items-center justify-center w-full py-5 text-xl font-bold tracking-[0.3em] uppercase text-obsidian bg-cyan-glow hover:bg-white transition-all duration-300 tactical-border box-shadow-cyan"
          >
            AUTHORIZE ACQUISITION
          </Link>
        </div>
      </div>

      <div className="pt-16 border-t border-obsidian-border relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-3 h-3 bg-cyan-glow animate-pulse-fast box-shadow-cyan"></span>
          <h3 className="text-2xl font-bold text-slate-200 uppercase tracking-[0.2em]">Related Tactical Assets</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {suggestedItems.map((suggested) => (
            <div key={suggested.id} className="group bg-obsidian-light/50 border border-obsidian-border overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 tactical-border-sm hover:box-shadow-cyan relative">
              <div className="relative h-48 w-full overflow-hidden bg-obsidian-border/50 p-1 border-b border-obsidian-border">
                <img 
                  src={suggested.imageLocation || ''} 
                  alt={suggested.itemName}
                  className="w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500"
                />
              </div>
              <div className="p-6 bg-obsidian-light/80">
                <h4 className="text-lg font-bold text-slate-100 mb-2 uppercase tracking-wider">{suggested.itemName}</h4>
                <div className="text-lg font-bold text-cyan-glow mb-6 tracking-widest">${suggested.price.toLocaleString()}</div>
                <Link 
                  href={`/productPage?itemCode=${suggested.itemCode}`}
                  className="flex items-center justify-center w-full py-2 bg-obsidian-border text-cyan-glow text-xs font-bold tracking-[0.2em] border border-obsidian-border hover:border-cyan-glow hover:bg-cyan-glow/10 transition-all duration-300 tactical-border-sm"
                >
                  ACCESS_DATA
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
