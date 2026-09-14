# Scoring

`EvaluationProvider.evaluate(transcript, exercisePrompt)` returns:

- `pronunciationScore`, `grammarScore`, `fluencyScore`, `vocabularyScore` (0-100)
- `overallScore` (0-100)
- `feedback` (free text)

The default provider (`OpenAiProvider`) prompts an LLM with the transcript and the exercise
prompt and asks for a JSON-shaped score. Swap in a `ClaudeProvider` or a fine-tuned pronunciation
model later by implementing `EvaluationProvider` and switching `EVALUATION_PROVIDER` in `.env` —
no changes needed in `EvaluationService` or the worker that calls it.
