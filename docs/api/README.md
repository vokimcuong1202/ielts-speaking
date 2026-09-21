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
| GET | /questions/:idOrSlug/practice | Question practice page (`/forecast/:part/:question`): `{ id, slug, partId, partLabel, title, position, total, topicLabel, isBookmarked, quota.remainingToday, attempts[], vocabularyByBand{6,7,8}, ideaSteps, sampleAnswers, previous, next }` (web `ForecastQuestionPractice`). `attempts` are latest first; a scored attempt carries `skills`, `transcript` diff segments (`plain`/`added`/`removed`) and a `shortened` rewrite with its tip; an unscored one has `status` `grading`/`invalid`/`failed`. Vocab items carry `saved` / `userVocabId`. `previous`/`next` walk the follow-ups of the same Part 2 card (Part 3) or the same part + topic group, and use slugs as ids |
| GET | /questions/:idOrSlug/support | "AI hỗ trợ" tab: `{ providers, samples[], note }`. Each sample = `{ id, band, body, notes, phrases[] }` where `phrases` are the question's suggested phrases found in the body (max 4) with `saved` / `userVocabId`; `note` is my own sample answer or null |
| PUT/DELETE | /questions/:idOrSlug/note | "Ghi chú – tạo câu mẫu của riêng bạn": `{ body (1–2000) }` upserts one note per user and question; DELETE returns 204 |
| POST | /translations | `{ text }` → `{ text, translation, source: dictionary\|provider\|none, provider }`. Known catalogue phrases translate from `vocab_items`; otherwise `translation` is null (mock provider) |
| POST | /pronunciation-checks | multipart `file` (≤5MB, not stored) + `text` → `{ text, provider, score 0-100, transcript, words[{word,status good\|improve}] }`. **Mock scoring** derived from the text |
| GET | /questions/:id/vocab?bandTier= | "Từ & cụm nên dùng" panel |
| GET | /questions/:id/attempts | My attempt history on this question |
| PUT/DELETE | /questions/:id/bookmark | "Lưu câu này" |
| GET | /forecast-sets/current | Current forecast set |
| GET | /forecast-sets/:setId/practice | "Luyện forecast" page: `{ quarterLabel, parts, part1, part2, part3, custom }` (web `ForecastPracticeData`) merged with my progress. Part 3 clusters = follow-ups of the set's Part 2 cue cards; `custom` is always empty until users can add questions |
| GET | /forecast-sets/:setId/questions?part&topicGroupId&flag&sort&limit | Forecast rows merged with my progress. `:setId` = id or `current` |
| GET | /forecast-sets/:setId/topics?part= | Topic cards with totals and my progress |
| GET | /examiner-voices | Selectable examiner voices |
| POST | /practice-sessions | `{ mode, part?, forecastSetId?, topicGroupId?, voiceCode?, questionCount?, hideQuestion? }` |
| POST | /practice-sessions/:id/attempts | `{ questionId, audioUrl, durationMs, questionRevealed? }` — enqueues transcription → scoring |
| PATCH | /practice-sessions/:id/finish | `{ abandoned? }` — no more attempts afterwards |
| GET | /practice-sessions/history | My sessions |
| GET | /practice-sessions/:id | Session with attempts and scores |
| GET | /attempts/:id | Result page: scores, errors, rewrite, transcript spans, question |
| POST | /attempts/:id/reports | "Báo lỗi": `{ reason?: transcript_wrong\|score_wrong\|audio_problem\|other, note? }`. One open report per user per attempt (repeat calls update it). 404 for attempts that are not yours |
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
| GET | /vocabulary/overview?status=&groupLimit= | "Sổ từ vựng" page: `{ reviewSummary, filterCounts, groups, remainingGroupsCount, topicOverview, topics }` (web `VocabularyNotebookData`). `status` = all/needsReview/mastered; `groupLimit` default 5 |
| GET | /vocabulary/topics | Topic library |
| GET | /vocabulary/topics/:id/detail | Topic page: `{ id, titleEn, titleVi, totalWords, masteredWords, hotPartsLabel, categoryCounts, words }` (web `VocabularyTopicDetail`); words carry `saved` / `userVocabId` |
| GET | /vocabulary/topics/:id?bandTier&kind | Topic items with `saved` flag |
| GET | /vocabulary/daily | Today's picks (created on first call each day) |
| GET | /vocabulary/notebook?state&sourceQuestionId | Saved words + `dueCount` |
| POST | /vocabulary/notebook | `{ vocabItemId, source?, sourceQuestionId?, sourceAttemptId? }` (idempotent) |
| POST | /vocabulary/notebook/custom | Bôi đen → lưu: `{ term, meaningVi, sourceQuestionId? }` adds/reuses the catalogue entry (kind by length: word / collocation / sentence_frame) and saves it with source `manual` |
| POST | /vocabulary/notebook/bulk | "Lưu cả N": `{ vocabItemIds[] (1–50), source?, sourceQuestionId?, sourceAttemptId? }` (idempotent, all-or-nothing on unknown ids) → saved entries |
| DELETE | /vocabulary/notebook/:id | |
| POST | /vocabulary/review/sessions | `{ limit? }` → session + due queue |
| POST | /vocabulary/review/sessions/:id/reviews | `{ userVocabId, rating: again\|hard\|good\|easy, revealedMs? }` |
| POST | /vocabulary/review/sessions/:id/finish | Summary (cards known, next due) |

**Not implemented yet** (tables exist): community "Bảng vàng" (`public_attempts`, `attempt_likes`, `follows`, `reports`),
AI tutor chat (`ai_conversations`, `ai_messages`), real translation and pronunciation-scoring providers (`modules/answer-support/providers/mock` are placeholders behind `TRANSLATION_PROVIDER` / `PRONUNCIATION_PROVIDER`), subscriptions/plans management, transcript diff spans generation,
`user_recommendations` generation, `user_question_progress.percentile`.
