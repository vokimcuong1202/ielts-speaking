import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BandCriterion, IeltsPart } from "../../../../../database/generated/client";
import { QuotaService } from "../quota/quota.service";
import { MockScoreRow, MockTestsRepository } from "./mock-tests.repository";
import { CreateMockTestDto } from "./dto/create-mock-test.dto";

const CRITERIA: BandCriterion[] = ["fluency", "lexical", "grammar", "pronunciation"];
const PENDING = ["recording", "uploaded", "grading"];

/** IELTS rounding: nearest half band (x.25 -> x.5, x.75 -> next whole). */
const toHalfBand = (value: number) => Math.round(value * 2) / 2;
const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

@Injectable()
export class MockTestsService {
  constructor(
    private readonly mockTestsRepository: MockTestsRepository,
    private readonly quotaService: QuotaService,
  ) {}

  async start(userId: string, dto: CreateMockTestDto) {
    if (dto.retakeOfId && !(await this.mockTestsRepository.findOwnedRetakeTarget(dto.retakeOfId, userId))) {
      throw new NotFoundException("Mock test to retake not found");
    }
    await this.quotaService.assertHasQuota(userId, "mock_test");
    const mockTest = await this.mockTestsRepository.create(userId, dto);
    await this.quotaService.consume(userId, "mock_test");
    return mockTest;
  }

  list(userId: string) {
    return this.mockTestsRepository.list(userId);
  }

  async getDetail(userId: string, id: bigint) {
    const mockTest = await this.mockTestsRepository.findDetail(id, userId);
    if (!mockTest) throw new NotFoundException("Mock test not found");
    return mockTest;
  }

  /** "Nộp bài": no more answers; scoring completes once every attempt has been graded. */
  async finish(userId: string, id: bigint) {
    const mockTest = await this.mockTestsRepository.findOwned(id, userId);
    if (!mockTest) throw new NotFoundException("Mock test not found");
    if (mockTest.status !== "in_progress") throw new BadRequestException(`Mock test is already ${mockTest.status}`);

    await this.mockTestsRepository.markGrading(id, mockTest.sessionId, Date.now() - mockTest.takenAt.getTime());
    await this.finalizeIfComplete(id);
    return this.mockTestsRepository.findOwned(id, userId);
  }

  /**
   * Called by the workers after every attempt settles, and by finish().
   * Does nothing until the test was submitted and no attempt is still in flight.
   */
  async finalizeIfComplete(mockTestId: bigint) {
    const mock = await this.mockTestsRepository.findForFinalize(mockTestId);
    if (!mock || mock.status !== "grading") return;
    if (mock.attempts.some((attempt) => PENDING.includes(attempt.status))) return;

    const scored = mock.attempts.filter((attempt) => attempt.status === "scored");
    if (scored.length === 0) {
      const reason = mock.attempts.find((attempt) => attempt.invalidReason)?.invalidReason ?? "no_speech";
      await this.mockTestsRepository.markInvalidated(mockTestId, reason);
      return;
    }

    const rows = scored.flatMap((attempt) =>
      attempt.attemptScores.map((score) => ({
        part: attempt.question.part,
        criterion: score.criterion,
        band: score.band.toNumber(),
      })),
    );
    const averageOf = (predicate: (row: (typeof rows)[number]) => boolean, criterion: BandCriterion) => {
      const bands = rows.filter((row) => row.criterion === criterion && predicate(row)).map((row) => row.band);
      return bands.length ? toHalfBand(mean(bands)) : null;
    };

    const scores: MockScoreRow[] = [];
    for (const criterion of CRITERIA) {
      const overall = averageOf(() => true, criterion);
      if (overall !== null) scores.push({ part: null, criterion, band: overall });
    }
    for (const part of new Set<IeltsPart>(scored.map((attempt) => attempt.question.part))) {
      for (const criterion of CRITERIA) {
        const band = averageOf((row) => row.part === part, criterion);
        if (band !== null) scores.push({ part, criterion, band });
      }
    }

    const bandOverall = toHalfBand(mean(scores.filter((score) => score.part === null).map((score) => score.band)));
    const previous = await this.mockTestsRepository.findPreviousScored(mock.userId, mock.takenAt);
    const deltaPrev = previous?.bandOverall ? toHalfBand(bandOverall - previous.bandOverall.toNumber()) : null;

    await this.mockTestsRepository.saveScored(mock, { bandOverall, deltaPrev, scores });
  }
}
