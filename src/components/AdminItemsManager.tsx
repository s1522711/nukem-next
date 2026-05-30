'use client'

import { useState } from 'react'
import { addItem, deleteItem } from '@/app/actions/admin'

type Item = {
  id: number
  itemCode: string
  itemName: string
  price: number
  imageLocation: string | null
  flairText: string | null
  flairColorClass: string | null
  flairTextColorClass: string | null
  flairLink: string | null
}

const COLOR_CLASSES = [
  { value: 'bg-blue-500', hex: '#3b82f6', label: 'Blue' },
  { value: 'bg-red-500', hex: '#ef4444', label: 'Red' },
  { value: 'bg-green-500', hex: '#22c55e', label: 'Green' },
  { value: 'bg-yellow-500', hex: '#eab308', label: 'Yellow' },
  { value: 'bg-purple-500', hex: '#a855f7', label: 'Purple' },
  { value: 'bg-pink-500', hex: '#ec4899', label: 'Pink' },
  { value: 'bg-gray-500', hex: '#6b7280', label: 'Gray' },
  { value: 'bg-white', hex: '#ffffff', label: 'White' },
  { value: 'bg-black', hex: '#000000', label: 'Black' },
]

const TEXT_COLOR_CLASSES = [
  { value: 'text-white', hex: '#ffffff', label: 'White' },
  { value: 'text-black', hex: '#000000', label: 'Black' },
  { value: 'text-blue-500', hex: '#3b82f6', label: 'Blue' },
  { value: 'text-red-500', hex: '#ef4444', label: 'Red' },
]

export function AdminItemsManager({ items }: { items: Item[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Flair Preview States
  const [flairText, setFlairText] = useState('')
  const [flairColorClass, setFlairColorClass] = useState('bg-blue-500')
  const [flairTextColorClass, setFlairTextColorClass] = useState('text-white')

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await addItem(formData)
      setIsModalOpen(false)
      // Reset form states
      setFlairText('')
      setFlairColorClass('bg-blue-500')
      setFlairTextColorClass('text-white')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-cyan-glow box-shadow-cyan"></span>
          <h2 className="text-xl font-bold text-slate-200 tracking-widest uppercase">Asset Database</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="tactical-border-sm bg-cyan-glow/10 border border-cyan-glow text-cyan-glow font-bold uppercase tracking-[0.2em] px-6 py-2 hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan transition-all text-[10px]"
        >
          Add Asset
        </button>
      </div>

      <div className="bg-obsidian-light/50 border border-obsidian-border overflow-hidden overflow-x-auto tactical-border-sm">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-obsidian-border/50 text-cyan-glow text-xs tracking-widest uppercase font-mono border-b border-cyan-glow/20">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Designation</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Flair Txt</th>
              <th className="px-6 py-4">Flair Bg</th>
              <th className="px-6 py-4">Flair Color</th>
              <th className="px-6 py-4">Flair Lnk</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border text-slate-300 font-mono text-sm">
            {items.map(i => (
              <tr key={i.id} className="hover:bg-cyan-glow/5 transition-colors group">
                <td className="px-6 py-4 text-cyan-glow/50">{i.itemCode}</td>
                <td className="px-6 py-4">
                  {i.imageLocation ? (
                    <img src={i.imageLocation} alt="" className="w-8 h-8 object-cover border border-obsidian-border tactical-border-sm mix-blend-luminosity group-hover:mix-blend-normal transition-all" />
                  ) : '-'}
                </td>
                <td className="px-6 py-4 font-bold group-hover:text-cyan-glow transition-colors uppercase">{i.itemName}</td>
                <td className="px-6 py-4 text-cyan-glow">${i.price.toLocaleString()}</td>
                <td className="px-6 py-4">{i.flairText || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{i.flairColorClass || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{i.flairTextColorClass || '-'}</td>
                <td className="px-6 py-4 truncate max-w-[100px] text-slate-500">{i.flairLink || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteItem}>
                    <input type="hidden" name="itemId" value={i.id} />
                    <button type="submit" className="text-crimson hover:text-white px-3 py-1 border border-crimson/30 hover:bg-crimson/20 hover:border-crimson text-[10px] uppercase tracking-widest transition-all">
                      Purge
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian overflow-hidden p-4 lg:p-8">
          <div className="w-full max-w-5xl h-full max-h-[90vh] relative animate-fade-in flex flex-col">
            
            {/* Tactical Brackets */}
            <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-cyan-glow"></div>
            <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-cyan-glow"></div>
            <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-cyan-glow"></div>
            <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-cyan-glow"></div>

            <div className="bg-obsidian border border-cyan-glow/30 p-8 tactical-border box-shadow-cyan relative overflow-y-auto flex-1 flex flex-col justify-start custom-scrollbar">
              {/* Scanline background */}
              <div className="absolute inset-0 bg-cyan-glow/5 mix-blend-overlay z-0 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-glow/30 blur-sm animate-scan z-0 pointer-events-none"></div>

              <div className="relative z-10 w-full flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6 border-b border-cyan-glow/30 pb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-3 h-3 bg-cyan-glow animate-pulse-fast box-shadow-cyan"></span>
                      <h3 className="text-2xl font-bold text-cyan-glow tracking-[0.2em] uppercase text-shadow-cyan">New Asset Registration</h3>
                    </div>
                    <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">SECURE_UPLINK_ESTABLISHED // AWAITING_INPUT</p>
                  </div>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-cyan-glow hover:text-crimson font-mono text-2xl transition-colors">
                    [X]
                  </button>
                </div>

                <form action={handleSubmit} className="flex flex-col flex-1">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                    
                    {/* Left Column: Core Designation */}
                    <div className="flex flex-col h-full space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1 h-5 bg-cyan-glow"></span>
                        <h4 className="text-base font-bold text-slate-200 uppercase tracking-widest">Core Designation</h4>
                      </div>

                      <div className="bg-obsidian-light/30 p-6 border border-obsidian-border flex-1 flex flex-col space-y-6 justify-center">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-cyan-glow/70 mb-2 uppercase tracking-widest">Asset_ID</label>
                            <input name="itemCode" required className="w-full bg-obsidian border border-cyan-glow/20 rounded-none px-3 py-2 text-cyan-glow font-mono text-sm focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" placeholder="NUK-01" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-cyan-glow/70 mb-2 uppercase tracking-widest">Base_Value ($)</label>
                            <input name="price" type="number" step="0.01" required className="w-full bg-obsidian border border-cyan-glow/20 rounded-none px-3 py-2 text-cyan-glow font-mono text-sm focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" placeholder="1000.00" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-cyan-glow/70 mb-2 uppercase tracking-widest">Asset_Nomenclature</label>
                          <input name="itemName" required className="w-full bg-obsidian border border-cyan-glow/20 rounded-none px-3 py-2 text-cyan-glow font-mono text-sm focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" placeholder="Tactical Warhead" />
                        </div>

                        <div className="flex-1 flex flex-col">
                          <label className="block text-[10px] font-bold text-cyan-glow/70 mb-2 uppercase tracking-widest">Visual_Schematic_Upload</label>
                          <div className="relative border border-dashed border-cyan-glow/30 p-4 bg-obsidian flex-1 flex items-center justify-center hover:bg-cyan-glow/5 transition-colors cursor-pointer min-h-[80px]">
                            <input name="imageFile" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="text-cyan-glow font-mono text-xs uppercase tracking-widest pointer-events-none text-center">
                              [ CLICK_OR_DRAG_FILE_HERE ]
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Tactical Metadata */}
                    <div className="flex flex-col h-full space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1 h-5 bg-cyan-glow"></span>
                        <h4 className="text-base font-bold text-slate-200 uppercase tracking-widest">Tactical Metadata</h4>
                      </div>

                      <div className="bg-obsidian-light/30 p-6 border border-obsidian-border flex-1 flex flex-col space-y-6 justify-center">
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-cyan-glow/70 mb-2 uppercase tracking-widest">Tag_String</label>
                            <input 
                              name="flairText" 
                              value={flairText}
                              onChange={(e) => setFlairText(e.target.value)}
                              className="w-full bg-obsidian border border-cyan-glow/20 rounded-none px-3 py-2 text-cyan-glow font-mono text-sm focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" 
                              placeholder="RESTRICTED" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-cyan-glow/70 mb-2 uppercase tracking-widest">Tag_Routing</label>
                            <input 
                              name="flairLink" 
                              className="w-full bg-obsidian border border-cyan-glow/20 rounded-none px-3 py-2 text-cyan-glow font-mono text-sm focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" 
                              placeholder="/category/restricted" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-cyan-glow/70 mb-2 uppercase tracking-widest">BG_Matrix</label>
                            <select 
                              name="flairColorClass" 
                              value={flairColorClass}
                              onChange={(e) => setFlairColorClass(e.target.value)}
                              className="w-full bg-obsidian border border-cyan-glow/20 rounded-none px-3 py-2 text-cyan-glow font-mono text-sm focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan"
                            >
                              {COLOR_CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-cyan-glow/70 mb-2 uppercase tracking-widest">FG_Matrix</label>
                            <select 
                              name="flairTextColorClass" 
                              value={flairTextColorClass}
                              onChange={(e) => setFlairTextColorClass(e.target.value)}
                              className="w-full bg-obsidian border border-cyan-glow/20 rounded-none px-3 py-2 text-cyan-glow font-mono text-sm focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan"
                            >
                              {TEXT_COLOR_CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Live Preview Console */}
                        <div className="flex-1 flex flex-col min-h-[80px]">
                          <label className="block text-[10px] font-bold text-cyan-glow/70 mb-2 uppercase tracking-widest">Live_Telemetry_Render</label>
                          <div className="p-4 border border-cyan-glow/30 bg-obsidian relative flex-1 flex items-center justify-center">
                            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-glow/50"></div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-glow/50"></div>
                            
                            <span 
                              className={`px-4 py-1 text-xs font-bold tracking-[0.2em] uppercase border border-cyan-glow/50 ${flairColorClass} ${flairTextColorClass}`}
                              style={{
                                backgroundColor: COLOR_CLASSES.find(c => c.value === flairColorClass)?.hex || '#3b82f6',
                                color: TEXT_COLOR_CLASSES.find(c => c.value === flairTextColorClass)?.hex || '#ffffff'
                              }}
                            >
                              [{flairText || 'SYS_TAG'}]
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 pt-6 border-t border-cyan-glow/20 w-full">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex items-center justify-center text-center w-full sm:w-1/3 py-4 px-6 border border-crimson/50 text-crimson hover:bg-crimson hover:text-white transition-colors duration-300 uppercase tracking-[0.2em] text-xs font-bold box-shadow-crimson order-2 sm:order-1">
                      Abort_Sequence
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center text-center w-full sm:w-2/3 tactical-border-sm bg-cyan-glow/10 border border-cyan-glow text-cyan-glow font-bold uppercase tracking-[0.3em] hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan transition-all duration-300 disabled:opacity-50 py-4 px-8 text-xs order-1 sm:order-2">
                      {isSubmitting ? 'PROCESSING_UPLINK...' : 'AUTHORIZE_INSERTION'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
