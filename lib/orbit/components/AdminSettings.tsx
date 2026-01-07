'use client';

import React, { useState } from 'react';
import { Settings, X, Loader2 } from 'lucide-react';
import roomStyles from '@/styles/Eburon.module.css';

interface AdminSettingsProps {
  onClose?: () => void;
  activeTab?: string;
  hideHeader?: boolean;
  meetingId?: string;
}

export function AdminSettings({ onClose, hideHeader = false, meetingId }: AdminSettingsProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className={roomStyles.sidebarPanel}>
      {/* Header - Simplified to just a close button if needed */}
      {!hideHeader && onClose && (
        <div className="flex justify-end p-2 bg-black/40 border-b border-white/5">
          <button
            onClick={onClose}
            aria-label="Close settings"
            title="Close settings"
            className="p-1 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white group"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          </button>
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
          src="https://eburon.ai/broadcaster/main/?id=918884&pass=4405"
          className="w-full h-full border-0"
          title="Broadcaster Dashboard"
          allow="microphone; camera; display-capture; autoplay; clipboard-read; clipboard-write; speaker-selection; screen-wake-lock"
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
