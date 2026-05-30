'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function MissileSim({ orderId, itemName }: { orderId: number, itemName: string }) {
  const router = useRouter()
  
  const [targetCoords, setTargetCoords] = useState<{x: number, y: number} | null>(null)
  const [activeSub, setActiveSub] = useState<{id: number, x: number, y: number} | null>(null)
  const [phase, setPhase] = useState<'AWAITING' | 'LAUNCHED' | 'IMPACT' | 'DESTROYED'>('AWAITING')

  // Valid submarine fleet locations globally deployed
  const subFleet = [
    { id: 1, x: 80, y: 150 },   // Pacific NW
    { id: 2, x: 80, y: 450 },   // Pacific SW
    { id: 3, x: 200, y: 300 },  // Pacific Central
    { id: 4, x: 400, y: 220 },  // Mid Atlantic
    { id: 5, x: 380, y: 480 },  // South Atlantic
    { id: 6, x: 620, y: 480 },  // Indian Ocean
    { id: 7, x: 500, y: 560 },  // Southern Ocean
    { id: 8, x: 920, y: 250 },  // Pacific East
    { id: 9, x: 920, y: 450 },  // Pacific SE
    { id: 10, x: 300, y: 150 }, // Atlantic N
    { id: 11, x: 750, y: 550 }, // South of Australia
    { id: 12, x: 850, y: 150 }, // North Pacific East
  ]

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (phase !== 'AWAITING') return

    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    
    // Cross-browser coordinate mapping for preserveAspectRatio="xMidYMid slice"
    const viewBoxWidth = 1000
    const viewBoxHeight = 600
    
    const scaleX = rect.width / viewBoxWidth
    const scaleY = rect.height / viewBoxHeight
    const scale = Math.max(scaleX, scaleY)
    
    const scaledWidth = viewBoxWidth * scale
    const scaledHeight = viewBoxHeight * scale
    
    const offsetX = (scaledWidth - rect.width) / 2
    const offsetY = (scaledHeight - rect.height) / 2
    
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    
    const x = (clickX + offsetX) / scale
    const y = (clickY + offsetY) / scale

    setTargetCoords({ x, y })
    
    // Calculate how much of the viewBox is chopped off by the slice aspect ratio
    const cropX = offsetX / scale
    const cropY = offsetY / scale

    // Filter fleet to ONLY submarines that are physically visible on screen
    let onScreenSubs = subFleet.filter(sub => {
      return sub.x >= cropX + 20 && sub.x <= viewBoxWidth - cropX - 20 &&
             sub.y >= cropY + 20 && sub.y <= viewBoxHeight - cropY - 20
    })

    // Fallback if screen is incredibly tiny
    if (onScreenSubs.length === 0) onScreenSubs = subFleet
    
    // Find valid on-screen submarine fleet units far from target
    const MIN_DISTANCE = 350
    let validSpawns = onScreenSubs.filter(sub => {
      const dist = Math.sqrt(Math.pow(sub.x - x, 2) + Math.pow(sub.y - y, 2))
      return dist >= MIN_DISTANCE
    })

    // Fallback to furthest visible sub if target is somehow too close to all
    if (validSpawns.length === 0) {
      let furthest = onScreenSubs[0]
      let maxDist = 0
      for (const sub of onScreenSubs) {
        const dist = Math.sqrt(Math.pow(sub.x - x, 2) + Math.pow(sub.y - y, 2))
        if (dist > maxDist) {
          maxDist = dist
          furthest = sub
        }
      }
      validSpawns = [furthest]
    }

    // Pick random sub from valid fleet
    const randomSub = validSpawns[Math.floor(Math.random() * validSpawns.length)]
    
    // Lock the active sub
    setActiveSub(randomSub)

    setPhase('LAUNCHED')
  }

  // Animation Sequence
  useEffect(() => {
    if (phase === 'LAUNCHED') {
      const timer = setTimeout(() => {
        setPhase('IMPACT')
        
        setTimeout(() => {
          setPhase('DESTROYED')
        }, 3000)
        
      }, 3000) // 3 seconds flight time
      
      return () => clearTimeout(timer)
    }
  }, [phase])

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] bg-obsidian overflow-hidden border border-cyan-glow/20 z-0">
      
      {/* Detailed Cyber World Map */}
      <img 
        src="/world.svg" 
        alt="World Map" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none z-0" 
      />

      {/* Pure CSS Background Radar Grid */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px),
            linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
        }}
      />

      {/* Interactive Overlay for Submarine, Targets, and Missile Animations */}
      <svg key={phase} className="absolute inset-0 w-full h-full block z-20" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" onClick={handleMapClick}>
        
        {/* Force Safari hit-testing using explicit pointer-events and non-transparent RGBA */}
        <rect width="1000" height="600" fill="rgba(0,0,0,0.001)" style={{ pointerEvents: 'all' }} />

        {/* Submarine Fleet Idle Locations */}
        {subFleet.map(sub => {
          const isActive = activeSub?.id === sub.id;
          return (
            <g key={sub.id} transform={`translate(${sub.x}, ${sub.y})`}>
              {isActive ? (
                <>
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#fff" strokeWidth="2" className="animate-pulse" />
                  <circle cx="0" cy="0" r="2" fill="#fff" />
                  <text x="15" y="5" fill="#fff" fontSize="12" fontFamily="monospace" className="tracking-widest">
                    SSBN_LAUNCH_DETECTED
                  </text>
                </>
              ) : (
                <path d="M 0 -4 L 4 4 L -4 4 Z" fill="rgba(0, 240, 255, 0.5)" />
              )}
            </g>
          )
        })}

        {/* Target Location */}
        {targetCoords && (
          <g transform={`translate(${targetCoords.x}, ${targetCoords.y})`}>
            <line x1="-15" y1="0" x2="-5" y2="0" stroke="#ef4444" strokeWidth="2" />
            <line x1="5" y1="0" x2="15" y2="0" stroke="#ef4444" strokeWidth="2" />
            <line x1="0" y1="-15" x2="0" y2="-5" stroke="#ef4444" strokeWidth="2" />
            <line x1="0" y1="5" x2="0" y2="15" stroke="#ef4444" strokeWidth="2" />
            <circle cx="0" cy="0" r="2" fill="#ef4444" className="animate-ping" />
            <text x="15" y="-15" fill="#ef4444" fontSize="12" fontFamily="monospace" className="tracking-widest">
              TRG_LOCKED
            </text>
          </g>
        )}

        {/* Missile Trajectory */}
        {phase === 'LAUNCHED' && activeSub && targetCoords && (
          <g>
            <path 
              d={`M ${activeSub.x} ${activeSub.y} Q ${(activeSub.x + targetCoords.x) / 2} ${(activeSub.y + targetCoords.y) / 2 - 200} ${targetCoords.x} ${targetCoords.y}`} 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="2" 
              strokeDasharray="5,5"
              className="animate-pulse opacity-50"
            />
            {/* Animated Payload */}
            <circle cx="0" cy="0" r="4" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)">
              <animateMotion 
                dur="3s" 
                repeatCount="1" 
                path={`M ${activeSub.x} ${activeSub.y} Q ${(activeSub.x + targetCoords.x) / 2} ${(activeSub.y + targetCoords.y) / 2 - 200} ${targetCoords.x} ${targetCoords.y}`}
                fill="freeze"
              />
            </circle>
          </g>
        )}

        {/* Impact Explosion */}
        {(phase === 'IMPACT' || phase === 'DESTROYED') && targetCoords && (
          <g transform={`translate(${targetCoords.x}, ${targetCoords.y})`}>
            <circle cx="0" cy="0" r="0" fill="none" stroke="#ef4444" strokeWidth="4">
              <animate attributeName="r" from="0" to="150" dur="1s" fill="freeze" />
              <animate attributeName="opacity" from="1" to="0" dur="1s" fill="freeze" />
            </circle>
            <circle cx="0" cy="0" r="0" fill="#ef4444">
              <animate attributeName="r" from="0" to="50" dur="0.5s" fill="freeze" />
              <animate attributeName="opacity" from="0.8" to="0" dur="1s" fill="freeze" />
            </circle>
          </g>
        )}
      </svg>

      {/* UI Overlay */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className="bg-obsidian/80 border border-cyan-glow p-4 backdrop-blur-md">
          <div className="text-cyan-glow font-mono text-sm mb-2 flex justify-between gap-8">
            <span>ORD_ID:</span>
            <span>#{orderId}</span>
          </div>
          <div className="text-cyan-glow font-mono text-sm mb-2 flex justify-between gap-8">
            <span>PAYLOAD:</span>
            <span>{itemName}</span>
          </div>
          <div className="text-cyan-glow font-mono text-sm flex justify-between gap-8">
            <span>STATUS:</span>
            <span className={phase === 'AWAITING' ? 'animate-pulse text-yellow-400' : phase === 'LAUNCHED' ? 'text-crimson animate-pulse-fast' : 'text-crimson font-bold'}>
              {phase === 'AWAITING' ? 'AWAITING_TARGET' : phase === 'LAUNCHED' ? 'IN_FLIGHT' : phase === 'IMPACT' ? 'IMPACT' : 'OBLITERATED'}
            </span>
          </div>
        </div>
      </div>

      {phase === 'AWAITING' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-obsidian-light/90 border border-crimson p-6 text-center shadow-[0_0_30px_rgba(255,0,0,0.2)] animate-pulse">
            <h2 className="text-2xl font-bold text-crimson tracking-[0.2em] mb-2">SELECT TARGET COORDINATES</h2>
            <p className="text-slate-300 font-mono text-sm">Click anywhere on the tactical grid to authorize strike.</p>
          </div>
        </div>
      )}

      {phase === 'DESTROYED' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto bg-crimson/10 backdrop-blur-sm animate-fade-in z-50">
          <div className="bg-obsidian border-2 border-crimson p-8 text-center max-w-lg shadow-[0_0_50px_rgba(255,0,0,0.4)]">
            <div className="w-16 h-16 bg-crimson/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-crimson mb-4 tracking-[0.2em]">TARGET DESTROYED</h2>
            <p className="text-slate-300 font-mono mb-8">
              Order #{orderId} successfully delivered. The blast radius covers approximately 50km. Have a nice day.
            </p>
            <button 
              onClick={() => router.push(`/checkout/confirmed?orderId=${orderId}`)}
              className="inline-block py-4 px-8 bg-crimson/20 border border-crimson hover:bg-crimson text-white font-bold transition-colors tracking-widest uppercase text-sm"
            >
              VIEW AFTERMATH REPORT
            </button>
          </div>
        </div>
      )}

      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
    </div>
  )
}
