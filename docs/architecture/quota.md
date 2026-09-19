# Quota

Limits are **daily and per kind**, driven by the user's plan.

```
plans (free | pro)                     users.timezone
  daily_speaking_turns / unlimited_speaking      │
  daily_ai_scorings                              ▼
        │                              local "today" (streak/quota roll at 0h local)
        ▼                                        │
subscriptions (active, not past period end)     │
  └─ none? → free plan                          ▼
                         quota_usage (user_id, usage_date, kind) → used, allowance snapshot
```

- `QuotaService.getSummary` → `GET /quota/me`: per kind `{ used, allowance, remaining }` (`null` = unlimited).
- `assertHasQuota(userId, kind)` throws 403 when `remaining <= 0`; `consume(userId, kind)` upserts today's row and
  snapshots the allowance that applied that day.
- Where each kind is consumed:
  - `speaking_turn` — when an attempt is created (`POST /practice-sessions/:id/attempts`)
  - `ai_scoring` — by the evaluation worker after a successful score (attempts that end `invalid`/`failed` are free)
  - `mock_test` — when a mock test is started
  - `ai_tutor_message` — reserved for the AI tutor (not implemented yet)
- `plans` only defines limits for speaking turns and AI scorings; `mock_test` / `ai_tutor_message` are unlimited until a
  column (or `plans.features`) says otherwise.
- The old per-call cost log (`ai_usage_logs`) no longer exists in the schema, so provider cost is not tracked.
