'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/Eburon.module.css';
import { Settings as SettingsIcon, Mic } from 'lucide-react';

interface EburonOrbProps {
  meetingId: string;
  userId: string;
  onOpenSettings?: () => void;
}

export function EburonOrb({
  onOpenSettings,
}: EburonOrbProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 20, y: 100 }); 
  const dragStart = useRef({ x: 0, y: 0 });

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Visualizer Logic
  useEffect(() => {
    let animationId: number;

    const startProcessing = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        
        source.connect(analyser);
        source.connect(processor);
        processor.connect(audioContext.destination);
        processorRef.current = processor;

        const dataArr = new Uint8Array(analyser.frequencyBinCount);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const draw = () => {
          animationId = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArr);
          
          ctx.clearRect(0, 0, 72, 72);
          const volume = dataArr.reduce((a, b) => a + b) / dataArr.length;
          
          ctx.strokeStyle = '#43e97b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(36, 36, 22 + volume / 10, 0, Math.PI * 2);
          ctx.stroke();
        };
        draw();
      } catch (err) {
        console.error('Core processing error:', err);
      }
    };

    startProcessing();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Sync position to CSS variables
  useEffect(() => {
    if (orbRef.current) {
      orbRef.current.style.setProperty('--orb-right', `${pos.x}px`);
      orbRef.current.style.setProperty('--orb-bottom', `${pos.y}px`);
    }
  }, [pos]);

  // Dragging logic
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.gearBtn}`)) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    
    // Detect tap: if movement is less than 5px, treat as click
    const dist = Math.hypot(e.clientX - (dragStart.current.x + pos.x), e.clientY - (dragStart.current.y + pos.y));
    if (dist < 5) {
      onOpenSettings?.();
    }
  };

  return (
    <div 
      ref={orbRef}
      className={styles.orbitSystem}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className={styles.orbitRing} />
      <div className={styles.gearBtn} onClick={(e) => { e.stopPropagation(); onOpenSettings?.(); }}>
        <SettingsIcon className="w-4 h-4 text-white" />
      </div>
      <div 
        className={styles.ebPlanet}
        onClick={(e) => { e.stopPropagation(); onOpenSettings?.(); }}
      >
        <canvas ref={canvasRef} width={72} height={72} className={styles.planetCanvas} />
        <Mic className="w-7 h-7 text-white z-10" />
      </div>
    </div>
  );
}
