# API Contracts

Placeholder for OpenAPI/REST contract docs. All routes except `/auth/*` need `Authorization: Bearer <jwt>`.

**Conventions:** `bigserial` ids (everything except `users.id`) are JSON **strings**; requests accept `"12"` or `12`.
Numeric columns (bands, ease, probability) are JSON numbers. Dates are ISO strings; `@db.Date` columns are UTC midnight.

| Method | Path | Description |
|---|---|---|
| POST | /auth/register | `{ email, displayName, password }` → JWT |
| POST | /auth/login | → JWT |
| GET | /users/me | Profile + goal + streak |
| PATCH | /users/me | Update displayName / handle / avatarUrl / locale / timezone |
| PUT | /users/me/goal | `{ targetBand, examDate?, weeklyTargetSessions? }` |
| GET | /quota/me | Today's usage per kind vs. plan allowance |
| GET | /topic-groups?part= | Topic groups / Part 2 categories with question counts |
| GET | /topic-groups/:id | Group + its (non follow-up) questions |
| POST | /topic-groups | Create a group (**any authenticated user** — there is no admin role in the schema yet) |
| GET | /questions?part&topicGroupId&parentQuestionId&search&limit | Question list |
| GET | /questions/:id | Question + follow-ups, idea frames, sample answers, my progress |
| GET | /questions/:id/vocab?bandTier= | "Từ & cụm nên dùng" panel |
| GET | /questions/:id/attempts | My attempt history on this question |
| PUT/DELETE | /questions/:id/bookmark | "Lưu câu này" |
| GET | /forecast-sets/current | Current forecast set |
| GET | /forecast-sets/:setId/questions?part&topicGroupId&flag&sort&limit | Forecast rows merged with my progress. `:setId` = id or `current` |
| GET | /forecast-sets/:setId/topics?part= | Topic cards with totals and my progress |
| GET | /examiner-voices | Selectable examiner voices |
| POST | /practice-sessions | `{ mode, part?, forecastSetId?, topicGroupId?, voiceCode?, questionCount?, hideQuestion? }` |
| POST | /practice-sessions/:id/attempts | `{ questionId, audioUrl, durationMs, questionRevealed? }` — enqueues transcription → scoring |
| PATCH | /practice-sessions/:id/finish | `{ abandoned? }` — no more attempts afterwards |
| GET | /practice-sessions/history | My sessions |
| GET | /practice-sessions/:id | Session with attempts and scores |
| GET | /attempts/:id | Result page: scores, errors, rewrite, transcript spans, question |
| POST | /audio/upload | Upload audio, returns storage URL |
| POST | /mock-tests | `{ part?, voiceCode?, label?, retakeOfId? }` → mock test + `sessionId` to post attempts to |
| GET | /mock-tests | My mock tests |
| GET | /mock-tests/history?type=&limit=&offset= | "Thi thử" page: `{ activity, counts, attempts, totalAttemptsOlder }`. `type` = part1/part2/part3/full; default limit 10 |
| GET | /mock-tests/:id | Scores per part/criterion, attempts, retake chain |
| POST | /mock-tests/:id/finish | Submit; poll `GET /mock-tests/:id` until `scored` / `invalidated` |
| GET | /progress/dashboard | Home: goal, streak, stats, week strip, due vocab, recommendations, latest mock |
| GET | /progress/heatmap?days= | `practice_days` for the heatmap |
| GET | /progress/band-history | Band line: one point per scored mock test |
| GET | /progress/errors?limit= | "Lỗi lặp lại nhiều nhất" |
| POST | /progress/recommendations/:id/dismiss | |
| GET | /vocabulary/topics | Topic library |
| GET | /vocabulary/topics/:id?bandTier&kind | Topic items with `saved` flag |
| GET | /vocabulary/daily | Today's picks (created on first call each day) |
| GET | /vocabulary/notebook?state&sourceQuestionId | Saved words + `dueCount` |
| POST | /vocabulary/notebook | `{ vocabItemId, source?, sourceQuestionId?, sourceAttemptId? }` (idempotent) |
| DELETE | /vocabulary/notebook/:id | |
| POST | /vocabulary/review/sessions | `{ limit? }` → session + due queue |
| POST | /vocabulary/review/sessions/:id/reviews | `{ userVocabId, rating: again\|hard\|good\|easy, revealedMs? }` |
| POST | /vocabulary/review/sessions/:id/finish | Summary (cards known, next due) |

**Not implemented yet** (tables exist): community "Bảng vàng" (`public_attempts`, `attempt_likes`, `follows`, `reports`),
AI tutor (`ai_conversations`, `ai_messages`), subscriptions/plans management, transcript diff spans generation,
`user_recommendations` generation, `user_question_progress.percentile`.
