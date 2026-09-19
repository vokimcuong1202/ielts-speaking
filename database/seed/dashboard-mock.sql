-- Dev-only mock activity so the dashboard page has data for one user.
--   psql "$DATABASE_URL" -v uid=4b8d8743-c05a-4f65-b7da-b36406fc627b -f database/seed/dashboard-mock.sql
-- Only inserts, and skips entirely when the user already has attempts.
\set ON_ERROR_STOP on
SELECT set_config('mock.uid', :'uid', false);

DO $$
DECLARE
  uid   uuid := current_setting('mock.uid')::uuid;
  tz    text;
  today date;
  p3    bigint;
  aid   bigint;
  mid   bigint;
  i     int;
  d     date;
  roll  int;
  lvl   int;
BEGIN
  SELECT timezone INTO tz FROM users WHERE id = uid;
  IF tz IS NULL THEN RAISE EXCEPTION 'user % not found', uid; END IF;
  IF EXISTS (SELECT 1 FROM attempts WHERE user_id = uid) THEN
    RAISE NOTICE 'user % already has attempts - nothing inserted', uid;
    RETURN;
  END IF;
  today := (now() AT TIME ZONE tz)::date;
  SELECT min(id) INTO p3 FROM questions WHERE part = 'part3';

  INSERT INTO user_goals (user_id, target_band, exam_date, weekly_target_sessions)
  VALUES (uid, 7.0, today + 89, 5)
  ON CONFLICT (user_id) DO NOTHING;

  -- heatmap: 22 weeks, the last 12 days always active (current streak 12), the day before is a gap
  FOR d IN SELECT g::date FROM generate_series(today - 160, today, interval '1 day') g LOOP
    roll := abs(hashtext(d::text)) % 100;
    lvl := CASE WHEN roll < 32 THEN 0 WHEN roll < 55 THEN 1 WHEN roll < 74 THEN 2 WHEN roll < 90 THEN 3 ELSE 4 END;
    IF d > today - 12 THEN lvl := greatest(lvl, 1); END IF;
    IF d = today - 12 THEN lvl := 0; END IF;
    IF d = today THEN lvl := 2; END IF; -- matches the 2 attempts inserted below
    IF lvl > 0 THEN
      INSERT INTO practice_days (user_id, day, attempts_count, speaking_ms, intensity)
      VALUES (uid, d, (ARRAY[0,1,2,4,7])[lvl + 1], (ARRAY[0,1,2,4,7])[lvl + 1] * 45000, lvl)
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;

  INSERT INTO user_streaks (user_id, current_days, longest_days, current_started_on, last_active_day)
  VALUES (uid, 12, 31, today - 11, today)
  ON CONFLICT (user_id) DO NOTHING;

  -- two scored full mock tests: 6.0 twelve days ago, 6.5 (+0.5) five days ago
  FOR i IN 0..1 LOOP
    INSERT INTO mock_tests (user_id, label, status, band_overall, delta_prev, duration_ms, taken_at, scored_at, summary_vi)
    VALUES (uid, 'Full test ' || (i + 1), 'scored', CASE i WHEN 0 THEN 6.0 ELSE 6.5 END, CASE i WHEN 0 THEN NULL ELSE 0.5 END,
            (14 + i) * 60000, now() - ((12 - i * 7) || ' days')::interval, now() - ((12 - i * 7) || ' days')::interval + interval '20 minutes',
            'Phát âm tốt, cần đa dạng hóa từ vựng hơn.')
    RETURNING id INTO mid;
    INSERT INTO mock_test_scores (mock_test_id, part, criterion, band)
    SELECT mid, NULL, c, b FROM (VALUES ('fluency'::band_criterion, 6.5 + i * 0.5 - 0.5), ('lexical', 6.0 + i * 0.5),
                                        ('grammar', 6.0 + i * 0.5), ('pronunciation', 6.5 + i * 0.5)) v(c, b);
  END LOOP;

  -- scored attempts: two today (part 1 -> "done 6.5"), plus older ones across all parts
  FOR i IN 1..8 LOOP
    INSERT INTO attempts (user_id, question_id, status, duration_ms, transcript, band_overall, words_per_min, filler_count, recorded_at, scored_at)
    VALUES (
      uid,
      (ARRAY[1, 10, 7, 26, 26, p3, p3 + 1, 1])[i],
      'scored', 40000 + i * 5000, 'Mock transcript ' || i,
      (ARRAY[6.5, 6.5, 6.0, 5.5, 6.0, 6.0, 6.5, 5.5])[i], 120 + i, i % 4,
      CASE WHEN i <= 2 THEN now() - (i || ' minutes')::interval ELSE now() - ((i - 1) || ' days')::interval END,
      CASE WHEN i <= 2 THEN now() - (i || ' minutes')::interval ELSE now() - ((i - 1) || ' days')::interval END
    ) RETURNING id INTO aid;
    INSERT INTO attempt_scores (attempt_id, criterion, band)
    SELECT aid, c, (ARRAY[6.5, 6.5, 6.0, 5.5, 6.0, 6.0, 6.5, 5.5])[i] FROM unnest(enum_range(NULL::band_criterion)) c;
  END LOOP;

  INSERT INTO user_question_progress (user_id, question_id, attempts_count, first_band, last_band, best_band, band_delta, last_attempt_id, last_practiced_at)
  SELECT a.user_id, a.question_id, 1, a.band_overall, a.band_overall, a.band_overall, 0, a.id, a.scored_at
  FROM attempts a WHERE a.user_id = uid
  ON CONFLICT DO NOTHING;

  INSERT INTO user_stats (user_id, latest_band, first_band, mock_tests_count, speaking_ms_total, speaking_ms_week, forecast_done_count, forecast_avg_band,
                          bottleneck_criterion, bottleneck_note_vi)
  VALUES (uid, 6.5, 6.0, 2, 3600000, 900000, 4, 6.1, 'lexical', 'Từ vựng đang thấp nhất (trung bình 6.0) trong các lần luyện gần đây.')
  ON CONFLICT (user_id) DO NOTHING;
END $$;
