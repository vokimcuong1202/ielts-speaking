import { useCallback, useState } from "react";

export function useSpeakWord() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const speak = useCallback((text: string, id: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak, speakingId };
}
