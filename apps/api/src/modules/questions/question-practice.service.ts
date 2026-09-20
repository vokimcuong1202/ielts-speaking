import { Injectable, NotFoundException } from "@nestjs/common";
import { QuotaService } from "../quota/quota.service";
import { QuestionsRepository } from "./questions.repository";

type PracticeAttempt = Awaited<ReturnType<QuestionsRepository["findPracticeAttempts"]>>[number];
type PracticeVocab = Awaited<ReturnType<QuestionsRepository["findPracticeVocab"]>>[number];
type Segment = { text: string; kind: "plain" | "added" | "removed" };

const SKILLS = [
  { criterion: "fluency", id: "fluency", label: "Trôi chảy" },
  { criterion: "lexical", id: "vocabulary", label: "Từ vựng" },
  { criterion: "grammar", id: "grammar", label: "Ngữ pháp" },
  { criterion: "pronunciation", id: "pronunciation", label: "Phát âm" },
] as const;

const VOCAB_BAND_TABS = ["6", "7", "8"] as const;
type BandTab = (typeof VOCAB_BAND_TABS)[number];

const attemptStatusOf = (status: PracticeAttempt["status"]) =>
  status === "scored" || status === "invalid" || status === "failed" ? status : "grading";

/** Tiers below the first tab fold into it and tiers above the last fold into it. */
const bandTabOf = (tier: number): BandTab => (tier <= 6 ? "6" : tier >= 8 ? "8" : "7");

/** "0:48" */
const formatDuration = (durationMs: number | null) => {
  const totalSeconds = Math.round((durationMs ?? 0) / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
};

@Injectable()
export class QuestionPracticeService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly quotaService: QuotaService,
  ) {}

  /** Everything the question practice page renders, in the shape of web `ForecastQuestionPractice`. */
  async getPractice(userId: string, idOrSlug: string) {
    const question = await this.questionsRepository.findForPractice(idOrSlug);
    if (!question) throw new NotFoundException("Question not found");

    const [attempts, vocab, siblings, progress, timezone, quota] = await Promise.all([
      this.questionsRepository.findPracticeAttempts(userId, question.id),
      this.questionsRepository.findPracticeVocab(question.id),
      this.questionsRepository.findSiblings(question),
      this.questionsRepository.findProgress(userId, question.id),
      this.questionsRepository.findTimezone(userId),
      this.quotaService.getSummary(userId),
    ]);
    const saved = await this.questionsRepository.findSavedVocab(
      userId,
      vocab.map((row) => row.vocabItemId),
    );

    const index = siblings.findIndex((sibling) => sibling.id === question.id);
    const previous = index > 0 ? siblings[index - 1] : undefined;
    const next = index >= 0 ? siblings[index + 1] : undefined;
    const toLink = (sibling?: { slug: string; textEn: string }) =>
      sibling && { id: sibling.slug, title: sibling.textEn };

    return {
      id: String(question.id),
      slug: question.slug,
      partId: question.part,
      partLabel: `PART ${question.part.slice(-1)}`,
      title: question.textEn,
      position: index + 1,
      total: siblings.length,
      topicLabel: question.topicGroup?.nameVi ?? question.topicGroup?.nameEn ?? "",
      isBookmarked: progress?.isBookmarked ?? false,
      quota: { remainingToday: quota.usage.find((item) => item.kind === "speaking_turn")?.remaining ?? null },
      attempts: attempts.map((attempt) => this.buildAttempt(attempt, timezone, vocab)),
      vocabularyByBand: this.buildVocabulary(vocab, saved),
      ideaSteps: question.questionIdeaFrames.map((frame) => frame.bodyVi),
      sampleAnswers: question.sampleAnswers.map((sample) => ({
        band: sample.band.toNumber(),
        body: sample.bodyEn,
        notes: sample.notesVi,
      })),
      previous: toLink(previous),
      next: toLink(next),
    };
  }

  private buildAttempt(attempt: PracticeAttempt, timezone: string, vocab: PracticeVocab[]) {
    const status = attemptStatusOf(attempt.status);
    const scored = status === "scored";
    const rewrite = attempt.attemptRewrite;

    return {
      id: String(attempt.id),
      index: attempt.attemptNo,
      status,
      dateLabel: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", timeZone: timezone }).format(
        attempt.recordedAt,
      ),
      durationLabel: formatDuration(attempt.durationMs),
      band: scored ? (attempt.bandOverall?.toNumber() ?? null) : null,
      skills: scored
        ? SKILLS.map(({ criterion, id, label }) => ({
            id,
            label,
            score: attempt.attemptScores.find((score) => score.criterion === criterion)?.band.toNumber() ?? 0,
          }))
        : [],
      transcript: this.buildSegments(attempt),
      ...(scored &&
        rewrite && {
          shortened: {
            text: rewrite.bodyEn,
            highlight: this.findHighlight(rewrite.bodyEn, vocab),
            tip: rewrite.noteVi,
          },
        }),
    };
  }

  /** keep -> plain; delete/filler -> removed (its replacement follows as added); insert -> added. */
  private buildSegments(attempt: PracticeAttempt): Segment[] {
    if (attempt.attemptTranscriptSpans.length === 0) {
      return attempt.transcript ? [{ text: attempt.transcript, kind: "plain" }] : [];
    }
    return attempt.attemptTranscriptSpans.flatMap((span): Segment[] => {
      if (span.kind === "keep") return [{ text: span.text, kind: "plain" }];
      if (span.kind === "insert") return [{ text: span.text, kind: "added" }];
      return [
        { text: span.text, kind: "removed" },
        ...(span.replacement ? [{ text: span.replacement, kind: "added" as const }] : []),
      ];
    });
  }

  /** The first suggested phrase the rewrite actually uses, spelled as it appears in the rewrite. */
  private findHighlight(body: string, vocab: PracticeVocab[]) {
    const lowered = body.toLowerCase();
    for (const { vocabItem } of vocab) {
      const at = lowered.indexOf(vocabItem.term.toLowerCase());
      if (at >= 0) return body.slice(at, at + vocabItem.term.length);
    }
    return undefined;
  }

  private buildVocabulary(vocab: PracticeVocab[], saved: { id: bigint; vocabItemId: bigint }[]) {
    const savedByItem = new Map(saved.map((row) => [row.vocabItemId, row.id]));
    const byBand: Record<BandTab, ReturnType<QuestionPracticeService["toVocabItem"]>[]> = { "6": [], "7": [], "8": [] };
    for (const row of vocab) {
      byBand[bandTabOf(row.bandTier)].push(this.toVocabItem(row, savedByItem.get(row.vocabItemId)));
    }
    return byBand;
  }

  private toVocabItem({ vocabItem }: PracticeVocab, userVocabId?: bigint) {
    return {
      id: String(vocabItem.id),
      phrase: vocabItem.term,
      ipa: vocabItem.ipa ?? "",
      meaning: vocabItem.meaningVi,
      ...(vocabItem.exampleEn && {
        example: { en: vocabItem.exampleEn, highlight: vocabItem.term, vi: vocabItem.exampleVi ?? "" },
      }),
      saved: userVocabId !== undefined,
      userVocabId: userVocabId === undefined ? null : String(userVocabId),
    };
  }
}
