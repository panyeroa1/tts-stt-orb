'use client';

import React from 'react';
import { EburonDashboard } from '@/lib/EburonDashboard';
import roomStyles from '@/styles/Eburon.module.css';

export default function Page() {
  return (
    <main className={roomStyles.roomLayout}>
      <div className={roomStyles.ambient}><div className={roomStyles.orbLight} /></div>
      
      <EburonDashboard user={null} />

      <div className="fixed bottom-3 w-full text-center pointer-events-none z-[100]">
        <span className="text-[10px] font-black tracking-[0.2em] text-white/10 uppercase">
          Powered by <b className="text-white/20">Eburon AI</b>
        </span>
      </div>
    </main>
  );
}
