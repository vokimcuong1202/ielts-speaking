-- Dev-only mock tests so the "Thi thử" page shows every card state for one user.
--   psql "$DATABASE_URL" -v uid=4b8d8743-c05a-4f65-b7da-b36406fc627b -f database/seed/thi-thu-mock.sql
-- Only inserts, and skips when the user already has 'Seed ...' mock tests. Safe next to dashboard-mock.sql.
--
-- Cases: single-attempt part tests, a 4-attempt part 3 (weakest question + transcript diffs),
-- a full test with 11 attempts, a retake chain (Thi lại 1 / Thi lại 2 with delta), an invalidated test with
-- recorded answers, a half-graded full test, a just-started test with no answers, and 12 older
-- single-attempt tests so "Xem thêm" pagination (10 per page) kicks in.
\set ON_ERROR_STOP on
SELECT set_config('mock.uid', :'uid', false);

-- attempt_bands: one entry per attempt; NULL = still grading. Invalid tests ignore the values.
CREATE FUNCTION pg_temp.seed_mock(
  uid uuid, p_label text, p_part ielts_part, p_status mock_status, p_band numeric, p_delta numeric,
  p_retake_of bigint, p_days_ago numeric, p_qids bigint[], p_attempt_bands numeric[],
  p_spans boolean DEFAULT false, p_invalid invalid_reason DEFAULT NULL
) RETURNS bigint LANGUAGE plpgsql AS $f$
DECLARE
  taken  timestamptz := now() - (p_days_ago || ' days')::interval;
  sid    bigint;
  mid    bigint;
  aid    bigint;
  i      int;
  b      numeric;
  a_stat attempt_status;
  txt    text;
BEGIN
  INSERT INTO practice_sessions (user_id, mode, part, hide_question, started_at, finished_at)
  VALUES (uid, CASE WHEN p_part IS NULL THEN 'mock_full' ELSE 'mock_part' END::session_mode, p_part, false, taken,
          CASE WHEN p_status = 'in_progress' THEN NULL ELSE taken + interval '15 minutes' END)
  RETURNING id INTO sid;

  INSERT INTO mock_tests (user_id, session_id, label, status, invalid_reason, band_overall, delta_prev, duration_ms,
                          retake_of_id, taken_at, scored_at, summary_vi)
  VALUES (uid, sid, p_label, p_status, p_invalid, p_band, p_delta,
          CASE WHEN p_status = 'in_progress' THEN NULL ELSE 14 * 60000 + 30000 END, p_retake_of, taken,
          CASE WHEN p_status IN ('scored', 'invalidated') THEN taken + interval '20 minutes' END,
          CASE WHEN p_status = 'scored' AND coalesce(array_length(p_qids, 1), 0) > 1 THEN NULL
               WHEN p_status = 'scored' THEN 'Trả lời tự nhiên, cần thêm ví dụ để mở rộng ý.' END)
  RETURNING id INTO mid;

  IF p_status = 'scored' THEN
    INSERT INTO mock_test_scores (mock_test_id, part, criterion, band)
    SELECT mid, NULL, c, greatest(p_band + o, 4.0) FROM (VALUES
      ('fluency'::band_criterion, 0.0), ('lexical', -0.5), ('grammar', 0.0), ('pronunciation', 0.5)) v(c, o);
  END IF;

  FOR i IN 1..coalesce(array_length(p_qids, 1), 0) LOOP
    b := p_attempt_bands[i];
    a_stat := CASE WHEN p_status = 'invalidated' THEN 'invalid'
                   WHEN b IS NULL THEN 'grading' ELSE 'scored' END;
    txt := CASE WHEN i % 2 = 0 THEN 'I think popular people can make many many friends easily and people usually want to help them.'
                ELSE 'Yes, I like it because it is very interesting for me.' END;
    INSERT INTO attempts (user_id, session_id, question_id, mock_test_id, status, invalid_reason, duration_ms, transcript,
                          band_overall, words_per_min, filler_count, recorded_at, scored_at)
    VALUES (uid, sid, p_qids[i], mid, a_stat, CASE WHEN a_stat = 'invalid' THEN p_invalid END, 30000 + i * 4000,
            CASE WHEN a_stat IN ('scored', 'invalid') THEN txt END, b, CASE WHEN b IS NOT NULL THEN 110 + i END,
            CASE WHEN b IS NOT NULL THEN i % 3 END, taken + (i || ' minutes')::interval,
            CASE WHEN a_stat = 'scored' THEN taken + (i || ' minutes')::interval + interval '30 seconds' END)
    RETURNING id INTO aid;

    IF a_stat = 'scored' THEN
      INSERT INTO attempt_scores (attempt_id, criterion, band, comment_vi)
      SELECT aid, c, greatest(b + o, 4.0),
             CASE WHEN c = 'lexical' THEN 'Từ vựng còn lặp — thử thêm một cụm từ tự nhiên hơn.' END
      FROM (VALUES ('fluency'::band_criterion, 0.0), ('lexical', -0.5), ('grammar', 0.0), ('pronunciation', 0.5)) v(c, o);

      IF p_spans AND i % 2 = 0 THEN
        INSERT INTO attempt_transcript_spans (attempt_id, char_start, char_end, kind, text, replacement) VALUES
          (aid, 0, 33, 'keep', 'I think popular people can make ', NULL),
          (aid, 33, 42, 'delete', 'many many', 'a lot of'),
          (aid, 42, 98, 'keep', ' friends easily and people usually want to help them.', NULL);
      END IF;
    END IF;
  END LOOP;
  RETURN mid;
END $f$;

DO $$
DECLARE
  uid uuid := current_setting('mock.uid')::uuid;
  p1 bigint[]; p2 bigint[]; p3 bigint[]; fullq bigint[];
  root bigint; r1 bigint; n int;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = uid) THEN RAISE EXCEPTION 'user % not found', uid; END IF;
  IF EXISTS (SELECT 1 FROM mock_tests WHERE user_id = uid AND label LIKE 'Seed %') THEN
    RAISE NOTICE 'user % already has Seed mock tests - nothing inserted', uid;
    RETURN;
  END IF;

  SELECT array_agg(id ORDER BY id) INTO p1 FROM (SELECT id FROM questions WHERE part = 'part1' AND is_active ORDER BY id LIMIT 6) q;
  SELECT array_agg(id ORDER BY id) INTO p2 FROM (SELECT id FROM questions WHERE part = 'part2' AND is_active ORDER BY id LIMIT 2) q;
  SELECT array_agg(id ORDER BY id) INTO p3 FROM (SELECT id FROM questions WHERE part = 'part3' AND is_active ORDER BY id LIMIT 4) q;
  IF coalesce(array_length(p1, 1), 0) < 6 OR coalesce(array_length(p2, 1), 0) < 2 OR coalesce(array_length(p3, 1), 0) < 4 THEN
    RAISE EXCEPTION 'need at least 6 part1, 2 part2 and 4 part3 questions - seed questions first';
  END IF;
  fullq := p1[1:6] || p2[1:1] || p3[1:4];  -- 11 questions

  -- grading / in progress (newest)
  PERFORM pg_temp.seed_mock(uid, 'Seed Full test (grading)', NULL, 'grading', NULL, NULL, NULL, 0.02, fullq,
    ARRAY[6.0, 6.5, 6.0, 5.5, 6.0, 6.5, 6.0, NULL, NULL, NULL, NULL]::numeric[]);
  PERFORM pg_temp.seed_mock(uid, 'Seed Part 2 (just started)', 'part2', 'in_progress', NULL, NULL, NULL, 0.01, ARRAY[]::bigint[], ARRAY[]::numeric[]);

  -- invalidated with 2 recorded answers
  PERFORM pg_temp.seed_mock(uid, 'Seed Part 1 (invalid)', 'part1', 'invalidated', NULL, NULL, NULL, 1.2, p1[1:2],
    ARRAY[NULL, NULL]::numeric[], false, 'off_topic');

  -- many attempts: part 3 with 4 answers (weakest = 5.0, transcript diffs)
  PERFORM pg_temp.seed_mock(uid, 'Seed Part 3', 'part3', 'scored', 5.5, NULL, NULL, 2.5, p3, ARRAY[5.0, 6.0, 5.5, 5.5]::numeric[], true);

  -- single attempt: part 2 (short answer, no spans) and part 1 (transcript diff)
  PERFORM pg_temp.seed_mock(uid, 'Seed Part 2', 'part2', 'scored', 6.0, NULL, NULL, 3.5, p2[1:1], ARRAY[6.0]::numeric[]);
  PERFORM pg_temp.seed_mock(uid, 'Seed Part 1', 'part1', 'scored', 6.5, NULL, NULL, 4.5, p1[1:1], ARRAY[6.5]::numeric[]);

  -- retake chain of full tests: 5.5 -> 6.0 (Thi lại 1) -> 6.5 (Thi lại 2, +1.0 so với lần đầu)
  root := pg_temp.seed_mock(uid, 'Seed Full test', NULL, 'scored', 5.5, NULL, NULL, 40, fullq,
    ARRAY[5.5, 5.5, 5.0, 6.0, 5.5, 5.5, 5.5, 6.0, 5.0, 5.5, 5.5]::numeric[], true);
  r1 := pg_temp.seed_mock(uid, 'Seed Full test', NULL, 'scored', 6.0, 0.5, root, 20, fullq,
    ARRAY[6.0, 6.0, 5.5, 6.5, 6.0, 6.0, 6.0, 6.5, 5.5, 6.0, 6.0]::numeric[], true);
  PERFORM pg_temp.seed_mock(uid, 'Seed Full test', NULL, 'scored', 6.5, 0.5, r1, 7, fullq,
    ARRAY[6.5, 6.5, 6.0, 7.0, 6.5, 6.5, 6.5, 7.0, 6.0, 6.5, 6.5]::numeric[], true);

  -- older single-attempt tests to push the list past one page
  FOR n IN 1..12 LOOP
    PERFORM pg_temp.seed_mock(uid, 'Seed Part ' || (n % 2 + 1) || ' #' || n, (ARRAY['part1', 'part2'])[n % 2 + 1]::ielts_part,
      'scored', 5.0 + (n % 4) * 0.5, NULL, NULL, 45 + n * 4,
      CASE WHEN n % 2 = 0 THEN p1[1:1] ELSE p2[1:1] END, ARRAY[5.0 + (n % 4) * 0.5]::numeric[]);
  END LOOP;

  RAISE NOTICE 'inserted Thi thử mock data for user %', uid;
END $$;
