import type { Metadata } from 'next'
import { Share_Tech_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { getSession } from '@/lib/session'

const shareTech = Share_Tech_Mono({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NUKEM COMMAND // STORE',
  description: 'Tactical Munitions & Armaments Logistics',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="en" className="dark">
      <body className={`${shareTech.className} min-h-screen bg-obsidian text-slate-200 antialiased relative overflow-x-hidden`}>
        {/* CRT Scanline Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
        {/* Scanning beam animation */}
        <div className="pointer-events-none fixed left-0 top-0 w-full h-[10px] bg-cyan-glow/10 blur-sm z-50 animate-scan"></div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar session={session} />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
