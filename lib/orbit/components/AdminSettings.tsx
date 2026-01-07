'use client';

import React, { useState } from 'react';
import { Settings, X, Loader2 } from 'lucide-react';
import roomStyles from '@/styles/Eburon.module.css';

interface AdminSettingsProps {
  onClose?: () => void;
  activeTab?: string;
  hideHeader?: boolean;
}

export function AdminSettings({ onClose, hideHeader = false }: AdminSettingsProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className={roomStyles.sidebarPanel}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Settings className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase">Room Settings</h2>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Broadcaster Control</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close settings"
              title="Close settings"
              className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white group"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}
        </div>
      )}

      {/* Content - Iframe Embed */}
      <div className="flex-1 w-full relative bg-black/40 overflow-hidden flex flex-col">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-[#0a0a0a]">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Initializing Broadcaster...</span>
          </div>
        )}
        <iframe 
          src="https://eburon.ai/broadcaster/main/index.html"
          className="w-full h-full border-0"
          title="Broadcaster Dashboard"
          allow="microphone; display-capture; autoplay; clipboard-write"
          onLoad={() => setLoading(false)}
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-downloads"
        />
      </div>

      {/* Footer Branding */}
      <div className="p-4 bg-black/40 border-t border-white/5">
        <div className="flex flex-col items-center gap-1 opacity-20">
          <span className="text-[7px] font-black tracking-[0.3em] text-slate-400 uppercase">Powered by</span>
          <span className="text-[8px] font-black tracking-tighter text-white">EBURON AI</span>
        </div>
      </div>
    </div>
  );
}
