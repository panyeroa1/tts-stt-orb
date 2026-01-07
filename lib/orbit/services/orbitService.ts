
import { supabase } from './supabaseClient';

export interface RoomState {
  activeSpeakerUserId: string | null;
  activeSpeakerSince: string | null;
  lockVersion: number;
}

export async function ensureRoomState(roomCode: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('ensure_room_state', { p_room_code: roomCode });
  if (error) {
    console.error('Error ensuring room state:', error);
    return null;
  }
  return data;
}

export async function acquireSpeakerLock(roomCode: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('acquire_speaker_lock', {
    p_room_code: roomCode,
    p_user_id: userId
  });
  if (error) {
    console.error('Error acquiring speaker lock:', error);
    return false;
  }
  return !!data;
}

// Alias for roomStateService compatibility if needed
export const tryAcquireSpeaker = acquireSpeakerLock;

export async function releaseSpeakerLock(roomCode: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('release_speaker_lock', {
    p_room_code: roomCode,
    p_user_id: userId
  });
  if (error) {
    console.error('Error releasing speaker lock:', error);
    return false;
  }
  return !!data;
}

export const releaseSpeaker = releaseSpeakerLock;


export function subscribeToRoomState(roomId: string, callback: (state: any) => void) {
  return supabase
    .channel(`public:room_state:${roomId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'room_state',
      filter: `room_id=eq.${roomId}`
    }, (payload) => callback(payload.new))
    .subscribe();
}
