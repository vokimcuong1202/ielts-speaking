import { Injectable } from "@nestjs/common";
import { EvaluationOutcome, EvaluationProvider } from "../../evaluation.provider";

@Injectable()
export class MockEvaluationProvider implements EvaluationProvider {
  readonly name = "mock";

  async evaluate(_transcript: string, _questionText: string, _errorTypeSlugs: string[]): Promise<EvaluationOutcome> {
    return {
      result: {
        bandOverall: 6.5,
        criteria: {
          fluency: { band: 6.5, commentVi: "Nói khá trôi chảy (dữ liệu giả lập)." },
          lexical: { band: 6.5, commentVi: "Vốn từ ổn (dữ liệu giả lập)." },
          grammar: { band: 6.5, commentVi: "Ngữ pháp ổn (dữ liệu giả lập)." },
          pronunciation: { band: 6.5, commentVi: "Phát âm rõ (dữ liệu giả lập)." },
        },
        errors: [],
      },
    };
  }
}
