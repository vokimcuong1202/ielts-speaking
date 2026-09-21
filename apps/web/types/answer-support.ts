export interface SupportPhrase {
  id: string;
  phrase: string;
  ipa: string;
  meaning: string;
  saved: boolean;
  /** Notebook entry id, needed to un-save. */
  userVocabId: string | null;
}

export interface SupportSample {
  id: string;
  band: number;
  body: string;
  notes: string | null;
  /** Suggested phrases that actually appear in `body`. */
  phrases: SupportPhrase[];
}

export interface AnswerSupport {
  /** "mock" providers give placeholder results; the UI says so. */
  providers: { translation: string; pronunciation: string };
  samples: SupportSample[];
  note: { body: string; updatedAt: string } | null;
}

export interface Translation {
  text: string;
  /** null when nothing can translate it yet; the learner then types the meaning. */
  translation: string | null;
  source: "dictionary" | "provider" | "none";
}

export interface PronunciationResult {
  text: string;
  provider: string;
  /** 0-100 */
  score: number;
  transcript: string;
  words: { word: string; status: "good" | "improve" }[];
}
