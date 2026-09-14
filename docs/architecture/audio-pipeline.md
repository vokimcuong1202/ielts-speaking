# Audio / Speech Pipeline

```
Browser
   │ upload audio
   ▼
AudioController → S3Storage (audio.url)
   │
   ▼
PracticeSessionsService
   ├── QuotaService.assertHasQuota()
   ├── PracticeSessionsRepository.create()  (status = UPLOADED)
   └── enqueue TRANSCRIPTION_QUEUE
            │
            ▼
   TranscriptionWorker
            │
            ▼
   TranscriptionService → TranscriptionProvider (Deepgram / Mock)
            │
            ├── persist Transcription row
            ├── QuotaService.recordTranscriptionUsage()
            └── enqueue EVALUATION_QUEUE
                     │
                     ▼
            EvaluationWorker
                     │
                     ▼
            EvaluationService → EvaluationProvider (OpenAI / Mock)
                     │
                     ├── persist Evaluation row
                     ├── QuotaService.recordEvaluationUsage()
                     └── status = COMPLETED
```

Application code never imports `@deepgram/sdk` or `openai` directly outside of the
`providers/` folders — it depends on the `TranscriptionProvider` / `EvaluationProvider`
interfaces, so a provider can be swapped (or mocked in tests) without touching business logic.
