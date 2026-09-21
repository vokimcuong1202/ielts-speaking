export interface TranslationProvider {
  readonly name: string;
  /** Vietnamese translation of an English phrase or sentence, or null when it cannot translate. */
  translate(text: string): Promise<string | null>;
}

export const TRANSLATION_PROVIDER = Symbol("TRANSLATION_PROVIDER");
