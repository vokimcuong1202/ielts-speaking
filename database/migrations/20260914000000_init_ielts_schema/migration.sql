-- =====================================================================
-- IELTS Speaking Practice App — PostgreSQL schema
-- Matches the backend task plan (backend-tasks.md)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- for gen_random_uuid()

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'canceled', 'past_due');

CREATE TYPE question_part AS ENUM ('part1', 'part2', 'part3');

CREATE TYPE attempt_status AS ENUM ('pending_scoring', 'processing', 'completed', 'failed');

CREATE TYPE session_type AS ENUM ('part1_drill', 'part2_drill', 'part3_drill', 'mock_test');

CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');

CREATE TYPE ai_call_type AS ENUM ('stt', 'pronunciation', 'llm_scoring');

CREATE TYPE correction_type AS ENUM ('grammar', 'vocabulary', 'coherence');

-- ---------------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------------

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               TEXT NOT NULL UNIQUE,
    password_hash       TEXT,                       -- null if signed up via Google
    google_id           TEXT UNIQUE,
    name                TEXT NOT NULL,
    role                user_role NOT NULL DEFAULT 'student',
    target_band         NUMERIC(2,1),                -- e.g. 7.0
    exam_date           DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role);

-- ---------------------------------------------------------------------
-- SUBSCRIPTIONS
-- ---------------------------------------------------------------------

CREATE TABLE subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status                  subscription_status NOT NULL DEFAULT 'expired',
    provider                TEXT NOT NULL,             -- 'vnpay' | 'momo' | 'stripe'
    provider_customer_id    TEXT,
    provider_subscription_id TEXT,
    current_period_start    TIMESTAMPTZ,
    current_period_end      TIMESTAMPTZ,
    canceled_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Convenience: only one active subscription per user at a time
CREATE UNIQUE INDEX uq_subscriptions_active_per_user
    ON subscriptions(user_id)
    WHERE status = 'active';

-- ---------------------------------------------------------------------
-- TOPIC GROUPS & QUESTIONS
-- One TopicGroup = one exam topic; its Part 2 cue card and Part 3
-- questions are thematically linked, matching the real IELTS format.
-- ---------------------------------------------------------------------

CREATE TABLE topic_groups (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,                 -- e.g. "Learning a new skill"
    forecast_season     TEXT,                          -- e.g. "2026-Q3"
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_topic_groups_forecast_season ON topic_groups(forecast_season);
CREATE INDEX idx_topic_groups_active ON topic_groups(is_active);

CREATE TABLE questions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_group_id      UUID NOT NULL REFERENCES topic_groups(id) ON DELETE CASCADE,
    part                question_part NOT NULL,
    text                TEXT NOT NULL,
    order_index         INTEGER NOT NULL DEFAULT 0,     -- order within the part/topic
    prep_seconds        INTEGER,                        -- e.g. 60 for Part 2, null for Part 1/3
    speak_seconds        INTEGER,                        -- e.g. 120 for Part 2
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Part 2 has exactly one cue card per topic group
    CONSTRAINT chk_part2_timing CHECK (
        part <> 'part2' OR (prep_seconds IS NOT NULL AND speak_seconds IS NOT NULL)
    )
);

CREATE INDEX idx_questions_topic_group_id ON questions(topic_group_id);
CREATE INDEX idx_questions_part ON questions(part);

-- Enforce exactly one Part 2 cue card per topic group
CREATE UNIQUE INDEX uq_one_part2_per_topic_group
    ON questions(topic_group_id)
    WHERE part = 'part2';

-- ---------------------------------------------------------------------
-- PRACTICE SESSIONS
-- Groups multiple attempts together (a Part 1 drill, or a full mock
-- test spanning Part 1 + 2 + 3 from one topic group).
-- ---------------------------------------------------------------------

CREATE TABLE practice_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type                session_type NOT NULL,
    status              session_status NOT NULL DEFAULT 'in_progress',
    topic_group_id      UUID REFERENCES topic_groups(id),   -- set for mock_test sessions
    started_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at        TIMESTAMPTZ
);

CREATE INDEX idx_practice_sessions_user_id_started_at ON practice_sessions(user_id, started_at DESC);
CREATE INDEX idx_practice_sessions_status ON practice_sessions(status);

-- ---------------------------------------------------------------------
-- ATTEMPTS
-- One recorded answer to one question. Scoring happens per attempt,
-- immediately on upload — this is what keeps results fast.
-- ---------------------------------------------------------------------

CREATE TABLE attempts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id              UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id             UUID NOT NULL REFERENCES questions(id),
    status                  attempt_status NOT NULL DEFAULT 'pending_scoring',
    raw_audio_key           TEXT NOT NULL,          -- object storage key, original upload
    normalized_audio_key    TEXT,                   -- after ffmpeg pre-processing
    duration_seconds        NUMERIC(6,2),
    transcript              TEXT,
    filler_word_count       INTEGER,
    failure_reason          TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attempts_user_id_created_at ON attempts(user_id, created_at DESC);
CREATE INDEX idx_attempts_session_id ON attempts(session_id);
CREATE INDEX idx_attempts_status ON attempts(status);

-- ---------------------------------------------------------------------
-- SCORES (per attempt)
-- ---------------------------------------------------------------------

CREATE TABLE scores (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id              UUID NOT NULL UNIQUE REFERENCES attempts(id) ON DELETE CASCADE,
    fluency_coherence       NUMERIC(2,1) NOT NULL CHECK (fluency_coherence BETWEEN 0 AND 9),
    lexical_resource        NUMERIC(2,1) NOT NULL CHECK (lexical_resource BETWEEN 0 AND 9),
    grammatical_range       NUMERIC(2,1) NOT NULL CHECK (grammatical_range BETWEEN 0 AND 9),
    pronunciation           NUMERIC(2,1) NOT NULL CHECK (pronunciation BETWEEN 0 AND 9),
    overall_band            NUMERIC(2,1) NOT NULL CHECK (overall_band BETWEEN 0 AND 9),
    corrections             JSONB NOT NULL DEFAULT '[]',   -- [{original, corrected, type, explanation}]
    summary_feedback        TEXT,
    raw_pronunciation_data  JSONB,                          -- raw response from pronunciation API
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scores_attempt_id ON scores(attempt_id);

-- ---------------------------------------------------------------------
-- SESSION SCORES (aggregated, no AI call — pure computation)
-- ---------------------------------------------------------------------

CREATE TABLE session_scores (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id              UUID NOT NULL UNIQUE REFERENCES practice_sessions(id) ON DELETE CASCADE,
    fluency_coherence       NUMERIC(2,1) NOT NULL,
    lexical_resource        NUMERIC(2,1) NOT NULL,
    grammatical_range       NUMERIC(2,1) NOT NULL,
    pronunciation           NUMERIC(2,1) NOT NULL,
    overall_band            NUMERIC(2,1) NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- STREAKS
-- ---------------------------------------------------------------------

CREATE TABLE streaks (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak          INTEGER NOT NULL DEFAULT 0,
    longest_streak          INTEGER NOT NULL DEFAULT 0,
    last_practice_date      DATE,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- AI USAGE LOG
-- One row per AI API call — powers monthly fair-use caps and cost
-- monitoring (see Task 8.3 / 11.1 in the backend task plan).
-- ---------------------------------------------------------------------

CREATE TABLE ai_usage_logs (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attempt_id              UUID REFERENCES attempts(id) ON DELETE SET NULL,
    call_type               ai_call_type NOT NULL,
    provider                TEXT NOT NULL,             -- 'openai' | 'azure' | 'anthropic' | 'self-hosted'
    duration_or_tokens      NUMERIC(10,2),              -- audio seconds or token count, depending on call_type
    estimated_cost_usd      NUMERIC(10,6) NOT NULL DEFAULT 0,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_usage_logs_user_id_created_at ON ai_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_ai_usage_logs_call_type ON ai_usage_logs(call_type);

-- ---------------------------------------------------------------------
-- CLASSES (teacher features — Phase 10)
-- ---------------------------------------------------------------------

CREATE TABLE classes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                TEXT NOT NULL,
    invite_code         TEXT NOT NULL UNIQUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);

CREATE TABLE class_members (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id            UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (class_id, student_id)
);

CREATE INDEX idx_class_members_class_id ON class_members(class_id);
CREATE INDEX idx_class_members_student_id ON class_members(student_id);

CREATE TABLE assignments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id            UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    topic_group_id      UUID REFERENCES topic_groups(id),
    title               TEXT NOT NULL,
    due_date            DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assignments_class_id ON assignments(class_id);

-- =====================================================================
-- updated_at auto-touch trigger (applied to tables that track it)
-- =====================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_attempts_updated_at
    BEFORE UPDATE ON attempts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
