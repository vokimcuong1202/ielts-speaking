import { useCallback, useEffect, useRef, useState } from "react";

/** One shared <audio> element: playing a new recording stops the previous one; clicking the playing one pauses it. */
export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = useCallback(
    (id: string, url: string) => {
      const current = audioRef.current;
      if (current && playingId === id) {
        current.pause();
        setPlayingId(null);
        return;
      }

      current?.pause();
      const audio = new Audio(url);
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => setPlayingId(null);
      audioRef.current = audio;
      setPlayingId(id);
      audio.play().catch(() => setPlayingId(null));
    },
    [playingId],
  );

  return { playingId, toggle };
}
