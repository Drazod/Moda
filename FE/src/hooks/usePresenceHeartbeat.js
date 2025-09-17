// src/hooks/usePresenceHeartbeat.js
import { useEffect } from 'react';
import axiosInstance from '../configs/axiosInstance';

const GUEST_KEY = 'gid';
function ensureGuestId() {
  let gid = localStorage.getItem(GUEST_KEY);
  if (!gid) {
    gid = crypto.randomUUID?.() || `gid_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(GUEST_KEY, gid);
  }
  return gid;
}

export default function usePresenceHeartbeat(intervalMs = 20000) {
  useEffect(() => {
    const gid = ensureGuestId();

    let stopped = false;
    const hit = async () => {
      try {
        // If logged-in, interceptor adds Authorization—server will prefer userId
        await axiosInstance.post('/metrics/heartbeat', { guestId: gid });
      } catch {}
    };

    hit(); // immediately
    const t = setInterval(hit, intervalMs);

    // Send one last ping when tab becomes visible again
    const vis = () => { if (!stopped && document.visibilityState === 'visible') hit(); };
    document.addEventListener('visibilitychange', vis);

    return () => {
      stopped = true;
      clearInterval(t);
      document.removeEventListener('visibilitychange', vis);
    };
  }, [intervalMs]);
}
