'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { SessionPayload } from '@/lib/session'

export function Navbar({ session }: { session: SessionPayload | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full bg-obsidian-light/95 border-b-2 border-cyan-glow/30 shadow-[0_4px_20px_rgba(0,240,255,0.1)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand and Desktop Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-3 h-3 bg-cyan-glow group-hover:animate-pulse-fast box-shadow-cyan"></span>
            <span className="text-xl font-bold text-cyan-glow tracking-[0.2em] text-shadow-cyan">NUKEM_SYS</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center border-l border-obsidian-border pl-8">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-cyan-glow hover:text-shadow-cyan transition-all duration-300 tracking-wider">DATABASE</Link>
            {session && (
              <Link href="/about" className="text-sm font-medium text-slate-400 hover:text-cyan-glow hover:text-shadow-cyan transition-all duration-300 tracking-wider">INTEL</Link>
            )}
            {session?.admin && (
              <Link href="/admin" className="text-sm font-bold text-crimson hover:text-red-400 hover:text-shadow-crimson transition-all duration-300 tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-crimson rounded-full animate-pulse-fast"></span>
                COMMAND_CENTER
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side: Desktop Auth & Mobile Toggle */}
        <div className="flex items-center gap-4">
          
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <Link href="/usercp" className="flex items-center gap-3 group">
                  <div className="tactical-border-sm w-8 h-8 bg-obsidian-border flex items-center justify-center text-sm font-bold text-cyan-glow group-hover:bg-cyan-dim group-hover:text-white transition-all duration-300 box-shadow-cyan border border-cyan-glow/20">
                    {session.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-glow transition-colors duration-300 tracking-wider">
                    OP_{session.username.toUpperCase()}
                  </span>
                </Link>
                <div className="w-px h-6 bg-obsidian-border"></div>
                <form action={logout}>
                  <button type="submit" className="text-sm font-medium text-slate-500 hover:text-crimson hover:text-shadow-crimson transition-colors duration-300 tracking-wider">
                    DISCONNECT
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-cyan-glow hover:text-shadow-cyan transition-all duration-300 tracking-wider">
                  AUTHENTICATE
                </Link>
                <Link href="/register" className="tactical-border-sm bg-cyan-glow/10 border border-cyan-glow text-cyan-glow px-6 py-2 text-sm font-bold hover:bg-cyan-glow hover:text-obsidian transition-all duration-300 tracking-widest box-shadow-cyan">
                  INITIALIZE
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`block w-6 h-[2px] bg-cyan-glow transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
            <span className={`block w-6 h-[2px] bg-cyan-glow transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-[2px] bg-cyan-glow transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-obsidian border-b border-cyan-glow/30 shadow-xl">
          <nav className="flex flex-col px-4 py-6 gap-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-slate-300 hover:text-cyan-glow tracking-wider uppercase flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-cyan-glow"></span>
              DATABASE
            </Link>
            
            {session && (
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-slate-300 hover:text-cyan-glow tracking-wider uppercase flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-cyan-glow"></span>
                INTEL
              </Link>
            )}
            
            {session?.admin && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-crimson hover:text-red-400 tracking-wider uppercase flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-crimson"></span>
                COMMAND_CENTER
              </Link>
            )}

            <div className="w-full h-px bg-obsidian-border my-2"></div>

            {session ? (
              <div className="flex flex-col gap-6">
                <Link href="/usercp" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-cyan-glow tracking-wider uppercase flex items-center gap-3">
                  <div className="w-6 h-6 bg-cyan-glow/20 border border-cyan-glow flex items-center justify-center text-xs">
                    {session.username[0].toUpperCase()}
                  </div>
                  OP_{session.username.toUpperCase()}
                </Link>
                <form action={logout}>
                  <button type="submit" className="text-sm font-bold text-crimson tracking-wider uppercase flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-crimson"></span>
                    DISCONNECT
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-slate-300 hover:text-cyan-glow tracking-wider uppercase flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-cyan-glow"></span>
                  AUTHENTICATE
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center tactical-border-sm bg-cyan-glow/10 border border-cyan-glow text-cyan-glow px-4 py-3 text-sm font-bold tracking-widest box-shadow-cyan">
                  INITIALIZE
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
