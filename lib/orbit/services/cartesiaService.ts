'use client';

const CARTESIA_API_KEY = process.env.NEXT_PUBLIC_CARTESIA_API_KEY || 'sk_car_Vx2ueKm4wEt1wZEEMj2eC3';
const CARTESIA_VERSION = '2025-04-16';

export async function speakText(text: string): Promise<void> {
  if (!CARTESIA_API_KEY) {
    throw new Error('Cartesia API Key is not configured');
  }

  const response = await fetch('https://api.cartesia.ai/tts/bytes', {
    method: 'POST',
    headers: {
      'Cartesia-Version': CARTESIA_VERSION,
      'X-API-Key': CARTESIA_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: 'sonic-3-latest',
      transcript: text,
      voice: {
        mode: 'id',
        id: 'dda33d93-9f12-4a59-806e-a98279ebf050',
      },
      output_format: {
        container: 'wav',
        encoding: 'pcm_f32le',
        sample_rate: 44100,
      },
      speed: 'normal',
      generation_config: {
        speed: 1,
        volume: 1,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Cartesia TTS failed');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  
  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    audio.play().catch(reject);
  });
}
