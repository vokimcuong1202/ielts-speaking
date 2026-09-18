import { VoiceOptionCard } from "./voice-option-card";
import type { PracticeVoiceOption } from "@/types/practice-setup";

interface VoiceSelectorProps {
  voices: PracticeVoiceOption[];
  selectedVoiceId: string;
  onSelect: (id: string) => void;
}

export function VoiceSelector({ voices, selectedVoiceId, onSelect }: VoiceSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wide text-ink-900">Giọng giám khảo</h2>
        <p className="text-xs text-ink-400">{voices.length} giọng bản ngữ</p>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        {voices.map((voice) => (
          <VoiceOptionCard key={voice.id} voice={voice} isSelected={voice.id === selectedVoiceId} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
