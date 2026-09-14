# System Design

## User journey

1. User registers/logs in.
2. User picks a practice exercise.
3. User records audio in the browser and uploads it.
4. Server checks quota, creates a `PracticeSession`, and enqueues transcription.
5. `TranscriptionWorker` calls Deepgram, stores the transcript, records quota usage.
6. `EvaluationWorker` calls the LLM evaluator, stores scores/feedback.
7. Frontend polls (or subscribes to) the session until `status = COMPLETED`, then shows the result.

## Why async, not synchronous request/response

Transcription and evaluation are external API calls with unpredictable latency and independent failure modes.
Doing them inline in the upload request would tie up an HTTP connection and make partial failures (STT succeeds,
LLM scoring fails) hard to retry cleanly. A queue (BullMQ/Redis) lets each stage retry on its own.

See [audio-pipeline.md](audio-pipeline.md), [scoring.md](scoring.md), [quota.md](quota.md).
