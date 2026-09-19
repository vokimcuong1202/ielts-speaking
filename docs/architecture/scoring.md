# Scoring

Attempt lifecycle (`attempts.status`): `uploaded` → `grading` → `scored`, or `invalid` (with `invalid_reason`) / `failed`.

1. `TranscriptionWorker` transcribes the audio. Empty transcript → `invalid/no_speech`; fewer than 3 words →
   `invalid/too_short`. Otherwise it stores `transcript`, `words_per_min`, `filler_count` and moves to `grading`.
2. `EvaluationWorker` calls `EvaluationProvider.evaluate(transcript, questionText, errorTypeSlugs)`, which returns an
   `EvaluationResult`:
   - `bandOverall` and four `criteria` (`fluency`, `lexical`, `grammar`, `pronunciation`) — band 1-9 in 0.5 steps
     plus a Vietnamese `commentVi`
   - `errors[]` — classified against the `error_types` catalogue by slug
   - optional `rewrite` ("Nói ngắn lại")
   Provider output is untrusted: `normalizeEvaluationResult` snaps bands to the 0.5 grid, clamps to 1-9 (the DB has
   CHECK constraints) and rejects responses missing a criterion.
3. `AttemptsRepository.saveEvaluation` writes `attempt_scores`, `attempt_errors`, `attempt_rewrites` and flips the
   attempt to `scored` in one transaction.
4. `ProgressService.recordScoredAttempt` rolls the attempt into `user_question_progress`, `user_topic_progress`,
   `practice_days` (heatmap), `user_streaks`, `user_stats` and `user_error_stats` in one transaction.

## Mock tests

`POST /mock-tests` creates a `practice_session` + `mock_tests` row; answers are posted to the session as normal attempts
(they get `attempts.mock_test_id` automatically). `POST /mock-tests/:id/finish` moves it to `grading`; once no attempt is
in flight (`MockTestsService.finalizeIfComplete`, called after every attempt settles) it:

- averages each criterion over all scored attempts (per part and overall → `mock_test_scores`),
- sets `band_overall` = mean of the four overall criteria, rounded to the nearest 0.5,
- sets `delta_prev` against the previous scored mock test,
- updates `user_stats`;
- or ends `invalidated` if no attempt could be scored.

Swap providers by implementing `EvaluationProvider` and switching `EVALUATION_PROVIDER` in `.env`.
