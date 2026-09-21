"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnswerSupport } from "@/hooks/use-answer-support";
import { usePronunciationCheck } from "@/hooks/use-pronunciation-check";
import { NoteEditor } from "./note-editor";
import { PronunciationPractice } from "./pronunciation-practice";
import { SampleCard } from "./sample-card";
import { SupportPhraseCard } from "./support-phrase-card";

/** Body of the "AI hỗ trợ" tab: sample answer, phrases worth learning, own note, pronunciation practice. */
export function AnswerSupportPanel({ questionSlug, questionId }: { questionSlug: string; questionId: string }) {
  const { support, savePhrase, savePhrases, removePhrase, saveNote, deleteNote } = useAnswerSupport(questionSlug, questionId);
  const pronunciation = usePronunciationCheck();
  const [sampleIndex, setSampleIndex] = useState(0);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [isNoteOpen, setIsNoteOpen] = useState<boolean | null>(null);
  const [practiceText, setPracticeText] = useState("");

  if (support.isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="size-5 animate-spin text-brand-600" />
      </div>
    );
  }
  if (support.isError || !support.data) {
    return <p className="py-10 text-center text-sm text-danger-text">Không tải được phần hỗ trợ, vui lòng thử lại.</p>;
  }

  const { samples, note, providers } = support.data;
  const sample = samples[sampleIndex % Math.max(samples.length, 1)];
  const unsaved = sample?.phrases.filter((phrase) => !phrase.saved) ?? [];
  // Until the learner toggles it, the note editor is open exactly when a note exists.
  const noteOpen = isNoteOpen ?? Boolean(note);

  async function withPending(ids: string[], action: () => Promise<unknown>) {
    setPendingIds((prev) => new Set([...prev, ...ids]));
    try {
      await action();
    } finally {
      setPendingIds((prev) => new Set([...prev].filter((id) => !ids.includes(id))));
    }
  }

  function practice(text: string) {
    setPracticeText(text);
    void pronunciation.start(text);
  }

  return (
    <div className="flex flex-col gap-4">
      {sample ? (
        <>
          <SampleCard key={sample.id} sample={sample} questionId={questionId} isTranslationMock={providers.translation === "mock"} />

          {sample.phrases.length > 0 ? (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink-900">Cụm đáng học trong câu mẫu</h3>
                <button
                  type="button"
                  disabled={unsaved.length === 0 || sample.phrases.some((phrase) => pendingIds.has(phrase.id))}
                  onClick={() => {
                    const ids = unsaved.map((phrase) => phrase.id);
                    void withPending(ids, () => savePhrases.mutateAsync(ids));
                  }}
                  className="cursor-pointer text-sm font-bold text-brand-700 disabled:cursor-default disabled:text-ink-400"
                >
                  {unsaved.length === 0 ? "Đã lưu hết" : `Lưu cả ${unsaved.length}`}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {sample.phrases.map((phrase) => (
                  <SupportPhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    isPending={pendingIds.has(phrase.id)}
                    onToggleSave={() =>
                      withPending([phrase.id], () =>
                        phrase.saved && phrase.userVocabId ? removePhrase.mutateAsync(phrase.userVocabId) : savePhrase.mutateAsync(phrase.id)
                      )
                    }
                    onPractice={() => practice(phrase.phrase)}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <p className="rounded-xl bg-page px-4 py-6 text-center text-sm text-ink-500">Câu này chưa có câu mẫu.</p>
      )}

      <Button variant="outline" className="w-full rounded-xl" disabled={samples.length <= 1} onClick={() => setSampleIndex((index) => index + 1)}>
        {samples.length <= 1 ? "Chưa có thêm câu mẫu" : "Cho mình câu mẫu khác"}
      </Button>

      <div className="rounded-xl border border-border p-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-ink-900">
          <input
            type="checkbox"
            checked={noteOpen}
            onChange={(event) => setIsNoteOpen(event.target.checked)}
            className="size-5 cursor-pointer rounded border-border-strong accent-brand-600"
          />
          Ghi chú – tạo câu mẫu của riêng bạn
        </label>
        {noteOpen ? (
          <div className="mt-3">
            <NoteEditor
              key={note?.updatedAt ?? "new"}
              initialBody={note?.body ?? ""}
              hasSavedNote={Boolean(note)}
              isSaving={saveNote.isPending}
              onSave={(body) => saveNote.mutate(body)}
              onDelete={() => deleteNote.mutate(undefined, { onSuccess: () => setIsNoteOpen(false) })}
            />
            {saveNote.isError ? <p role="alert" className="mt-1 text-xs text-danger-text">Không lưu được ghi chú, vui lòng thử lại.</p> : null}
          </div>
        ) : null}
      </div>

      <PronunciationPractice
        value={practiceText}
        onValueChange={setPracticeText}
        state={pronunciation.state}
        elapsedSeconds={pronunciation.elapsedSeconds}
        error={pronunciation.error}
        result={pronunciation.result}
        isMock={providers.pronunciation === "mock"}
        onStart={() => void pronunciation.start(practiceText)}
        onStop={() => void pronunciation.stop()}
      />
    </div>
  );
}
