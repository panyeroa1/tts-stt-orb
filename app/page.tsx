'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { EburonDashboard } from '@/lib/EburonDashboard';
import roomStyles from '@/styles/Eburon.module.css';

export default function Page() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Automatically sign in anonymously on load
    signInAnonymously(auth).catch((error) => {
      console.error("Anonymous sign-in error:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className={roomStyles.roomLayout}>
      <div className={roomStyles.ambient}><div className={roomStyles.orbLight} /></div>
      
      <EburonDashboard user={user} />

      <div className="fixed bottom-3 w-full text-center pointer-events-none z-[100]">
        <span className="text-[10px] font-black tracking-[0.2em] text-white/10 uppercase">
          Powered by <b className="text-white/20">Eburon AI</b>
        </span>
      </div>
    </main>
  );
}
