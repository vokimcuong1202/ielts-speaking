-- Dev-only mock for the question practice page ("Why are some students popular?").
--   psql "$DATABASE_URL" -v uid=442d0a20-a88c-4001-98be-4a51afb06eca -f database/seed/question-practice-mock.sql
-- Also adds band 6 / 8 sample answers for the question. Gives the user 5 scored attempts with bands 4.0 / 4.5 / 5.5 / 6.5 / 7.5 (one per score tone),
-- transcript diffs, "Nói ngắn lại" rewrites, and suggested vocabulary for the Band 6 / 7 / 8 tabs.
-- Inserts only, and skips when the user already has attempts on the question.
\set ON_ERROR_STOP on
SELECT set_config('mock.uid', :'uid', false);

DO $$
DECLARE
  uid   uuid := current_setting('mock.uid')::uuid;
  qid   bigint;
  aid   bigint;
  spec  jsonb;
  span  jsonb;
  pos   int;
  said  text;
  n     int := 0;
  t     record;
BEGIN
  SELECT id INTO qid FROM questions WHERE slug = 'why-are-some-students-popular';
  IF qid IS NULL THEN RAISE EXCEPTION 'question why-are-some-students-popular not found - run the base seed first'; END IF;
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = uid) THEN RAISE EXCEPTION 'user % not found', uid; END IF;

  -- ---- suggested vocabulary (idempotent) ------------------------------------------------------
  INSERT INTO vocab_items (term, ipa, kind, meaning_vi, example_en, example_vi, band_tier) VALUES
    ('stand out from the crowd', '/stænd aʊt frʌm ðə kraʊd/', 'collocation', 'nổi bật giữa đám đông',
       'Popular students usually stand out from the crowd in some way.', 'Học sinh nổi tiếng thường nổi bật giữa đám đông theo một cách nào đó.', 6),
    ('an approachable personality', '/ən əˈproʊtʃəbl ˌpɜːsəˈnæləti/', 'collocation', 'tính cách dễ gần', NULL, NULL, 6),
    ('be good at subjects', '/bi ɡʊd æt ˈsʌbdʒɪkts/', 'collocation', 'học giỏi các môn học', NULL, NULL, 6),
    ('command respect', '/kəˈmɑːnd rɪˈspekt/', 'collocation', 'được người khác nể trọng', NULL, NULL, 7),
    ('have a wide social circle', '/hæv ə waɪd ˈsoʊʃl ˈsɜːrkl/', 'collocation', 'có mạng lưới bạn bè rộng', NULL, NULL, 7),
    ('exude charisma', '/ɪɡˈzuːd kəˈrɪzmə/', 'collocation', 'toát lên sức hút', NULL, NULL, 8)
  ON CONFLICT (term, meaning_vi) DO NOTHING;

  INSERT INTO question_vocab (question_id, vocab_item_id, band_tier, sort_order, is_core)
  SELECT qid, v.id, x.tier, x.ord, false
  FROM (VALUES ('stand out from the crowd', 6, 0), ('an approachable personality', 6, 8), ('be good at subjects', 6, 9),
               ('command respect', 7, 0), ('have a wide social circle', 7, 1), ('exude charisma', 8, 1)) x(term, tier, ord)
  JOIN vocab_items v ON v.term = x.term
  ON CONFLICT DO NOTHING;

  -- extra sample answers so "Cho mình câu mẫu khác" has something to cycle through
  INSERT INTO sample_answers (question_id, band, body_en, notes_vi)
  SELECT qid, x.band, x.body, x.notes
  FROM (VALUES
    (6.0::numeric, 'Some students are popular because they are good at subjects like maths and they are really friendly. Other students like to be around them, and many of them look up to them.', 'Câu đơn giản, đủ ý — phù hợp band 6.'),
    (8.0::numeric, 'Some students are popular simply because they stand out from the crowd — maybe they have a good sense of humour, or they are just really good at subjects like maths. People naturally look up to them.', 'Dùng collocation tự nhiên và cấu trúc “maybe … or …” để nêu nhiều khả năng — band 8.')
  ) x(band, body, notes)
  WHERE NOT EXISTS (SELECT 1 FROM sample_answers sa WHERE sa.question_id = qid AND sa.band = x.band);

  IF EXISTS (SELECT 1 FROM attempts WHERE user_id = uid AND question_id = qid) THEN
    RAISE NOTICE 'user % already has attempts on question % - attempts not inserted', uid, qid;
    RETURN;
  END IF;

  -- ---- attempts: (band, skills f/l/g/p, days ago, duration ms, spans, rewrite, tip) ----------------
  FOR t IN SELECT * FROM (VALUES
    (4.0, 4.0, 4.0, 4.0, 4.0, 15, 33000,
      '[{"k":"keep","t":"Student popular because "},{"k":"delete","t":"he","r":"they are"},{"k":"keep","t":" good "},{"k":"insert","t":"at"},{"k":"keep","t":" study. Um, many friend "},{"k":"delete","t":"like","r":"likes"},{"k":"keep","t":" him."}]'::jsonb,
      'Some students are popular because they study well and have many friends.', 'Bắt đầu bằng một câu đầy đủ chủ ngữ – động từ.'),
    (4.5, 4.0, 4.0, 4.0, 5.0, 12, 41000,
      '[{"k":"keep","t":"Some student "},{"k":"delete","t":"is","r":"are"},{"k":"keep","t":" popular because "},{"k":"delete","t":"he","r":"they are"},{"k":"filler","t":" um"},{"k":"keep","t":" good in "},{"k":"delete","t":"subject","r":"subjects"},{"k":"keep","t":" and uh people like "},{"k":"delete","t":"him","r":"them"},{"k":"keep","t":"."}]'::jsonb,
      'Some students are popular because they are good at subjects and people like them.', 'Nói chậm lại và bỏ “um/uh” để câu trôi chảy hơn.'),
    (5.5, 5.0, 5.0, 6.0, 6.0, 8, 44000,
      '[{"k":"keep","t":"Some students "},{"k":"delete","t":"is","r":"are"},{"k":"keep","t":" popular because they are "},{"k":"delete","t":"very very","r":"extremely"},{"k":"keep","t":" good at study and "},{"k":"insert","t":"have"},{"k":"keep","t":" many friends in the school."}]'::jsonb,
      'Some students are popular because they are good at their studies and have many friends at school.', 'Tránh lặp “very very”; dùng từ mạnh hơn như “extremely”.'),
    (6.5, 6.0, 6.0, 7.0, 7.0, 5, 48000,
      '[{"k":"keep","t":"Some students are popular because they are "},{"k":"insert","t":"good at"},{"k":"keep","t":" subjects like math or English, and they "},{"k":"delete","t":"is","r":"are"},{"k":"keep","t":" well known in their school. Many children "},{"k":"delete","t":"look up","r":"look up to"},{"k":"keep","t":" them and want to be their friends."}]'::jsonb,
      'Some students are popular because they are good at subjects and well known in school. Many children look up to them and want to be their friends.', 'Gần band 7 rồi — thêm một cụm nâng cao như “a good sense of humour”.'),
    (7.5, 7.0, 7.0, 8.0, 8.0, 1, 52000,
      '[{"k":"keep","t":"Some students are popular because "},{"k":"insert","t":"they"},{"k":"keep","t":" stand out from the crowd. They are usually good at subjects like math or English, and they have "},{"k":"insert","t":"a"},{"k":"keep","t":" good sense of humour, so people find them approachable. Many classmates "},{"k":"insert","t":"look up to"},{"k":"keep","t":" them, which makes them "},{"k":"insert","t":"well known"},{"k":"keep","t":" across the whole school."}]'::jsonb,
      'Some students are popular because they stand out from the crowd. They are good at subjects, have a good sense of humour, and many classmates look up to them.', 'Rất tốt! Thử thêm một ví dụ cụ thể để tiến gần band 8.')
  ) AS v(band, f, l, g, p, days_ago, dur, spans, rewrite, tip)
  LOOP
    n := n + 1;
    INSERT INTO attempts (user_id, question_id, attempt_no, status, audio_url, duration_ms, band_overall, recorded_at, scored_at)
    VALUES (uid, qid, n, 'scored', 'mock://question-practice/' || n || '.webm', t.dur, t.band,
            now() - make_interval(days => t.days_ago), now() - make_interval(days => t.days_ago))
    RETURNING id INTO aid;

    INSERT INTO attempt_scores (attempt_id, criterion, band, comment_vi) VALUES
      (aid, 'fluency', t.f, NULL), (aid, 'lexical', t.l, NULL), (aid, 'grammar', t.g, NULL), (aid, 'pronunciation', t.p, NULL);

    pos := 0; said := '';
    FOR span IN SELECT * FROM jsonb_array_elements(t.spans) LOOP
      IF span->>'k' = 'insert' THEN
        INSERT INTO attempt_transcript_spans (attempt_id, char_start, char_end, kind, text)
        VALUES (aid, pos, pos, 'insert', span->>'t');
      ELSE
        INSERT INTO attempt_transcript_spans (attempt_id, char_start, char_end, kind, text, replacement)
        VALUES (aid, pos, pos + length(span->>'t'), span->>'k', span->>'t', span->>'r');
        pos := pos + length(span->>'t');
        said := said || (span->>'t');
      END IF;
    END LOOP;
    UPDATE attempts SET transcript = said WHERE id = aid;

    INSERT INTO attempt_rewrites (attempt_id, body_en, note_vi) VALUES (aid, t.rewrite, t.tip);
  END LOOP;

  INSERT INTO user_question_progress (user_id, question_id, attempts_count, first_band, last_band, best_band, band_delta,
                                      last_attempt_id, last_practiced_at)
  SELECT uid, qid, 5, 4.0, 7.5, 7.5, 3.5, max(id), max(recorded_at) FROM attempts WHERE user_id = uid AND question_id = qid
  ON CONFLICT (user_id, question_id) DO UPDATE SET attempts_count = 5, first_band = 4.0, last_band = 7.5, best_band = 7.5,
    band_delta = 3.5, last_attempt_id = EXCLUDED.last_attempt_id, last_practiced_at = EXCLUDED.last_practiced_at;

  -- two phrases already saved, so the panel shows both states
  INSERT INTO user_vocab (user_id, vocab_item_id, source, source_question_id)
  SELECT uid, id, 'question_panel', qid FROM vocab_items
  WHERE term IN ('stand out from the crowd', 'have a good sense of humour')
  ON CONFLICT (user_id, vocab_item_id) DO NOTHING;
END $$;
