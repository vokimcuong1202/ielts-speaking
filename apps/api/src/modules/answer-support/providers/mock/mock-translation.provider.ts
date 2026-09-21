import { Injectable } from "@nestjs/common";
import { TranslationProvider } from "../../translation.provider";

/**
 * TODO(later): call a real machine-translation / LLM service. The service already answers phrases it
 * knows from the vocabulary catalogue before asking the provider, so the mock simply has no translation:
 * the UI then lets the learner type the meaning themselves before saving.
 */
@Injectable()
export class MockTranslationProvider implements TranslationProvider {
  readonly name = "mock";

  async translate(): Promise<string | null> {
    return null;
  }
}
