# Quota & Cost Model

```
User quota (quota_accounts.quota_seconds, per billing period)
     ↓
Audio duration submitted per session
     ↓
usage_events (raw log: type=TRANSCRIPTION|EVALUATION, quantity, provider, cost)
     ↓
quota_accounts.used_seconds (running total, incremented per transcription)
     ↓
remaining quota = quota_seconds - used_seconds
```

`usage_events` is the source of truth — it's an append-only log of every billable call
(STT seconds consumed, evaluation requests made, which provider, and its estimated `cost`).
`quota_accounts.used_seconds` is a denormalized running total kept in sync for fast quota
checks (`QuotaService.assertHasQuota`) without summing `usage_events` on every request.

This split is what makes it possible to:
- answer "how many seconds does this user have left" cheaply (read `quota_accounts`)
- answer "what did this user actually cost us this month" precisely (sum `usage_events.cost`)
- reconstruct/audit quota if a bug ever desyncs the running total

TODO once pricing is decided: plan → `quota_seconds` mapping, and a per-provider `cost`
calculation (Deepgram $/min, OpenAI $/token) fed into `recordTranscriptionUsage` /
`recordEvaluationUsage`.
