"use client";

import { useAudioRecorder } from "../../hooks/use-audio-recorder";

export function AudioRecorder({ onRecorded }: { onRecorded: (blob: Blob) => void }) {
  const { isRecording, start, stop } = useAudioRecorder();

  const handleClick = async () => {
    if (isRecording) {
      onRecorded(await stop());
    } else {
      await start();
    }
  };

  return (
    <button className="cursor-pointer" onClick={handleClick}>
      {isRecording ? "Stop recording" : "Start recording"}
    </button>
  );
}
