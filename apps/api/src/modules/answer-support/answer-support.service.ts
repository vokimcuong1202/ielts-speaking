import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AnswerSupportRepository } from "./answer-support.repository";
import { TRANSLATION_PROVIDER, TranslationProvider } from "./translation.provider";
import { PRONUNCIATION_PROVIDER, PronunciationProvider } from "./pronunciation.provider";

const PHRASES_PER_SAMPLE = 4;

@Injectable()
export class AnswerSupportService {
  constructor(
    private readonly repository: AnswerSupportRepository,
    @Inject(TRANSLATION_PROVIDER) private readonly translationProvider: TranslationProvider,
    @Inject(PRONUNCIATION_PROVIDER) private readonly pronunciationProvider: PronunciationProvider,
  ) {}

  /** The "AI hỗ trợ" tab: sample answers with the phrases worth learning in each, plus my own note. */
  async getSupport(userId: string, idOrSlug: string) {
    const question = await this.requireQuestion(idOrSlug);
    const [note, saved] = await Promise.all([
      this.repository.findNote(userId, question.id),
      this.repository.findSavedVocab(userId, question.questionVocab.map((row) => row.vocabItemId)),
    ]);
    const savedByItem = new Map(saved.map((row) => [row.vocabItemId, row.id]));

    // The same phrase can sit in several band tiers; keep the first (highest-tier) row.
    const seen = new Set<bigint>();
    const vocab = question.questionVocab.filter((row) => (seen.has(row.vocabItemId) ? false : (seen.add(row.vocabItemId), true)));

    return {
      providers: { translation: this.translationProvider.name, pronunciation: this.pronunciationProvider.name },
      samples: question.sampleAnswers.map((sample) => {
        const body = sample.bodyEn.toLowerCase();
        return {
          id: String(sample.id),
          band: sample.band.toNumber(),
          body: sample.bodyEn,
          notes: sample.notesVi,
          phrases: vocab
            .filter((row) => body.includes(row.vocabItem.term.toLowerCase()))
            .slice(0, PHRASES_PER_SAMPLE)
            .map(({ vocabItem }) => ({
              id: String(vocabItem.id),
              phrase: vocabItem.term,
              ipa: vocabItem.ipa ?? "",
              meaning: vocabItem.meaningVi,
              saved: savedByItem.has(vocabItem.id),
              userVocabId: savedByItem.has(vocabItem.id) ? String(savedByItem.get(vocabItem.id)) : null,
            })),
        };
      }),
      note: note && { body: note.body, updatedAt: note.updatedAt },
    };
  }

  async saveNote(userId: string, idOrSlug: string, body: string) {
    const question = await this.requireQuestion(idOrSlug);
    if (!body.trim()) throw new BadRequestException("Note cannot be empty");
    const note = await this.repository.saveNote(userId, question.id, body.trim());
    return { body: note.body, updatedAt: note.updatedAt };
  }

  async deleteNote(userId: string, idOrSlug: string) {
    const question = await this.requireQuestion(idOrSlug);
    await this.repository.deleteNote(userId, question.id);
  }

  /** Phrases the vocabulary catalogue knows are answered from it; anything else goes to the provider. */
  async translate(text: string) {
    const known = await this.repository.findKnownMeaning(text.trim());
    if (known) return { text, translation: known.meaningVi, source: "dictionary" as const, provider: this.translationProvider.name };

    const translation = await this.translationProvider.translate(text);
    return { text, translation, source: translation ? ("provider" as const) : ("none" as const), provider: this.translationProvider.name };
  }

  async checkPronunciation(file: Express.Multer.File | undefined, text: string) {
    if (!file || file.size === 0) throw new BadRequestException("No audio received");
    const result = await this.pronunciationProvider.check(file.buffer, file.mimetype, text);
    return { text, provider: this.pronunciationProvider.name, ...result };
  }

  private async requireQuestion(idOrSlug: string) {
    const question = await this.repository.findQuestion(idOrSlug);
    if (!question) throw new NotFoundException("Question not found");
    return question;
  }
}
