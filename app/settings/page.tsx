'use client';

import React from 'react';
import { AdminSettings } from '@/lib/orbit/components/AdminSettings';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#1a1f2e] to-[#0a0f1e]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-slate-400">
            Configure your Orbit translation and integration settings
          </p>
        </div>

        {/* Settings Content */}
        <div className="bg-[#1a2333]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-[700px]">
          <AdminSettings onClose={() => window.location.assign('/')} />
        </div>
      </div>
    </div>
  );
}
