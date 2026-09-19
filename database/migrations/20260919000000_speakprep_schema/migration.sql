-- PostgreSQL database dump

\restrict dBaflpjAOg2UXIXV3MNyeDC2xnClW1Ttfnat4DNsjoZad7idKBjdrAuR0J9QaQd

-- Name: citext; Type: EXTENSION; Schema: -; Owner: -

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;

-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- Name: ai_role; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.ai_role AS ENUM (
    'user',
    'assistant',
    'system'
);

-- Name: attempt_status; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.attempt_status AS ENUM (
    'recording',
    'uploaded',
    'grading',
    'scored',
    'invalid',
    'failed'
);

-- Name: band_criterion; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.band_criterion AS ENUM (
    'fluency',
    'lexical',
    'grammar',
    'pronunciation'
);

-- Name: forecast_flag; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.forecast_flag AS ENUM (
    'hot',
    'new',
    'standard'
);

-- Name: ielts_part; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.ielts_part AS ENUM (
    'part1',
    'part2',
    'part3'
);

-- Name: invalid_reason; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.invalid_reason AS ENUM (
    'no_speech',
    'too_short',
    'off_topic',
    'mic_error',
    'language_other'
);

-- Name: mock_status; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.mock_status AS ENUM (
    'in_progress',
    'grading',
    'scored',
    'invalidated'
);

-- Name: plan_code; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.plan_code AS ENUM (
    'free',
    'pro'
);

-- Name: quota_kind; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.quota_kind AS ENUM (
    'speaking_turn',
    'ai_scoring',
    'ai_tutor_message',
    'mock_test'
);

-- Name: report_target; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.report_target AS ENUM (
    'attempt',
    'score',
    'vocab_item',
    'question',
    'public_attempt'
);

-- Name: session_mode; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.session_mode AS ENUM (
    'practice_question',
    'practice_topic',
    'mock_part',
    'mock_full'
);

-- Name: srs_rating; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.srs_rating AS ENUM (
    'again',
    'hard',
    'good',
    'easy'
);

-- Name: srs_state; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.srs_state AS ENUM (
    'new',
    'learning',
    'review',
    'mastered',
    'suspended'
);

-- Name: vocab_kind; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.vocab_kind AS ENUM (
    'word',
    'collocation',
    'idiom',
    'phrasal_verb',
    'sentence_frame'
);

-- Name: vocab_source; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.vocab_source AS ENUM (
    'question_panel',
    'topic_library',
    'mock_feedback',
    'manual',
    'daily_pick'
);

-- Name: voice_gender; Type: TYPE; Schema: public; Owner: -

CREATE TYPE public.voice_gender AS ENUM (
    'female',
    'male'
);

-- Name: ai_conversations; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.ai_conversations (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    attempt_id bigint,
    question_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_message_at timestamp with time zone
);

-- Name: ai_conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.ai_conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: ai_conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.ai_conversations_id_seq OWNED BY public.ai_conversations.id;

-- Name: ai_messages; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.ai_messages (
    id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    role public.ai_role NOT NULL,
    body text NOT NULL,
    suggested_chips text[],
    tokens integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Name: ai_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.ai_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: ai_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.ai_messages_id_seq OWNED BY public.ai_messages.id;

-- Name: attempt_errors; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.attempt_errors (
    id bigint NOT NULL,
    attempt_id bigint NOT NULL,
    error_type_id bigint,
    seq_no integer NOT NULL,
    at_ms integer,
    wrong_text text,
    correct_text text,
    sentence_en text,
    explanation_vi text,
    fixed_audio_url text,
    saved_to_notebook boolean DEFAULT false NOT NULL
);

-- Name: attempt_errors_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.attempt_errors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: attempt_errors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.attempt_errors_id_seq OWNED BY public.attempt_errors.id;

-- Name: attempt_likes; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.attempt_likes (
    attempt_id bigint NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Name: attempt_rewrites; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.attempt_rewrites (
    attempt_id bigint NOT NULL,
    label_vi text DEFAULT 'Nói ngắn lại'::text NOT NULL,
    body_en text NOT NULL,
    note_vi text,
    audio_url text
);

-- Name: attempt_scores; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.attempt_scores (
    attempt_id bigint NOT NULL,
    criterion public.band_criterion NOT NULL,
    band numeric(2,1) NOT NULL,
    comment_vi text,
    CONSTRAINT attempt_scores_band_check CHECK (((band >= (1)::numeric) AND (band <= (9)::numeric)))
);

-- Name: attempt_transcript_spans; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.attempt_transcript_spans (
    id bigint NOT NULL,
    attempt_id bigint NOT NULL,
    char_start integer NOT NULL,
    char_end integer NOT NULL,
    kind text NOT NULL,
    text text NOT NULL,
    replacement text,
    at_ms integer,
    CONSTRAINT attempt_transcript_spans_check CHECK ((char_end >= char_start)),
    CONSTRAINT attempt_transcript_spans_kind_check CHECK ((kind = ANY (ARRAY['keep'::text, 'delete'::text, 'insert'::text, 'filler'::text])))
);

-- Name: attempt_transcript_spans_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.attempt_transcript_spans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: attempt_transcript_spans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.attempt_transcript_spans_id_seq OWNED BY public.attempt_transcript_spans.id;

-- Name: attempts; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.attempts (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    session_id bigint,
    question_id bigint NOT NULL,
    mock_test_id bigint,
    attempt_no integer DEFAULT 1 NOT NULL,
    status public.attempt_status DEFAULT 'uploaded'::public.attempt_status NOT NULL,
    invalid_reason public.invalid_reason,
    audio_url text,
    duration_ms integer,
    question_revealed boolean DEFAULT false NOT NULL,
    transcript text,
    band_overall numeric(2,1),
    words_per_min integer,
    filler_count integer,
    recorded_at timestamp with time zone DEFAULT now() NOT NULL,
    scored_at timestamp with time zone,
    CONSTRAINT attempts_band_overall_check CHECK (((band_overall >= (1)::numeric) AND (band_overall <= (9)::numeric))),
    CONSTRAINT attempts_check CHECK (((status <> 'invalid'::public.attempt_status) OR (invalid_reason IS NOT NULL)))
);

-- Name: attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.attempts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.attempts_id_seq OWNED BY public.attempts.id;

-- Name: daily_vocab_picks; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.daily_vocab_picks (
    user_id uuid NOT NULL,
    pick_date date NOT NULL,
    vocab_item_id bigint NOT NULL,
    is_hero boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);

-- Name: error_types; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.error_types (
    id bigint NOT NULL,
    slug text NOT NULL,
    criterion public.band_criterion DEFAULT 'grammar'::public.band_criterion NOT NULL,
    label_vi text NOT NULL,
    label_en text,
    family_vi text,
    explainer_vi text
);

-- Name: error_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.error_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: error_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.error_types_id_seq OWNED BY public.error_types.id;

-- Name: examiner_voices; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.examiner_voices (
    code text NOT NULL,
    name text NOT NULL,
    gender public.voice_gender NOT NULL,
    accent text NOT NULL,
    sample_url text,
    is_active boolean DEFAULT true NOT NULL
);

-- Name: follows; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.follows (
    follower_id uuid NOT NULL,
    followee_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT follows_check CHECK ((follower_id <> followee_id))
);

-- Name: forecast_questions; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.forecast_questions (
    forecast_set_id bigint NOT NULL,
    question_id bigint NOT NULL,
    flag public.forecast_flag DEFAULT 'standard'::public.forecast_flag NOT NULL,
    appearances_30d integer DEFAULT 0 NOT NULL,
    probability numeric(5,2),
    entered_set_on date,
    sort_order integer DEFAULT 0 NOT NULL
);

-- Name: forecast_sets; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.forecast_sets (
    id bigint NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    quarter_label text NOT NULL,
    window_start date NOT NULL,
    window_end date NOT NULL,
    description text,
    is_current boolean DEFAULT false NOT NULL,
    published_at timestamp with time zone
);

-- Name: forecast_sets_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.forecast_sets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: forecast_sets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.forecast_sets_id_seq OWNED BY public.forecast_sets.id;

-- Name: mock_test_scores; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.mock_test_scores (
    id bigint NOT NULL,
    mock_test_id bigint NOT NULL,
    part public.ielts_part,
    criterion public.band_criterion NOT NULL,
    band numeric(2,1) NOT NULL,
    comment_vi text,
    CONSTRAINT mock_test_scores_band_check CHECK (((band >= (1)::numeric) AND (band <= (9)::numeric)))
);

-- Name: mock_test_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.mock_test_scores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: mock_test_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.mock_test_scores_id_seq OWNED BY public.mock_test_scores.id;

-- Name: mock_tests; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.mock_tests (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    session_id bigint,
    label text,
    voice_code text,
    status public.mock_status DEFAULT 'in_progress'::public.mock_status NOT NULL,
    invalid_reason public.invalid_reason,
    band_overall numeric(2,1),
    delta_prev numeric(3,1),
    duration_ms integer,
    retake_of_id bigint,
    taken_at timestamp with time zone DEFAULT now() NOT NULL,
    scored_at timestamp with time zone,
    summary_vi text,
    CONSTRAINT mock_tests_band_overall_check CHECK (((band_overall >= (1)::numeric) AND (band_overall <= (9)::numeric)))
);

-- Name: mock_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.mock_tests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: mock_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.mock_tests_id_seq OWNED BY public.mock_tests.id;

-- Name: plans; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.plans (
    code public.plan_code NOT NULL,
    name text NOT NULL,
    price_vnd integer DEFAULT 0 NOT NULL,
    billing_period text DEFAULT 'month'::text NOT NULL,
    unlimited_speaking boolean DEFAULT false NOT NULL,
    daily_speaking_turns integer,
    daily_ai_scorings integer,
    features jsonb DEFAULT '{}'::jsonb NOT NULL
);

-- Name: practice_days; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.practice_days (
    user_id uuid NOT NULL,
    day date NOT NULL,
    attempts_count integer DEFAULT 0 NOT NULL,
    speaking_ms bigint DEFAULT 0 NOT NULL,
    intensity smallint DEFAULT 0 NOT NULL,
    CONSTRAINT practice_days_intensity_check CHECK (((intensity >= 0) AND (intensity <= 4)))
);

-- Name: practice_sessions; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.practice_sessions (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    mode public.session_mode NOT NULL,
    part public.ielts_part,
    forecast_set_id bigint,
    topic_group_id bigint,
    voice_code text,
    question_count integer,
    hide_question boolean DEFAULT true NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    finished_at timestamp with time zone,
    abandoned boolean DEFAULT false NOT NULL
);

-- Name: practice_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.practice_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: practice_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.practice_sessions_id_seq OWNED BY public.practice_sessions.id;

-- Name: public_attempts; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.public_attempts (
    attempt_id bigint NOT NULL,
    question_id bigint NOT NULL,
    user_id uuid NOT NULL,
    band_overall numeric(2,1) NOT NULL,
    iso_week text NOT NULL,
    rank_in_week integer,
    likes_count integer DEFAULT 0 NOT NULL,
    published_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Name: question_idea_frames; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.question_idea_frames (
    id bigint NOT NULL,
    question_id bigint NOT NULL,
    step_no integer NOT NULL,
    body_vi text NOT NULL
);

-- Name: question_idea_frames_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.question_idea_frames_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: question_idea_frames_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.question_idea_frames_id_seq OWNED BY public.question_idea_frames.id;

-- Name: question_vocab; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.question_vocab (
    question_id bigint NOT NULL,
    vocab_item_id bigint NOT NULL,
    band_tier integer NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_core boolean DEFAULT false NOT NULL,
    CONSTRAINT question_vocab_band_tier_check CHECK (((band_tier >= 5) AND (band_tier <= 9)))
);

-- Name: questions; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.questions (
    id bigint NOT NULL,
    part public.ielts_part NOT NULL,
    slug text NOT NULL,
    text_en text NOT NULL,
    topic_group_id bigint,
    parent_question_id bigint,
    cue_card_bullets text[],
    prep_seconds integer,
    speak_seconds integer,
    prompt_audio_url text,
    ipa_hint text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT questions_check CHECK (((parent_question_id IS NULL) OR (part = 'part3'::public.ielts_part)))
);

-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;

-- Name: quota_usage; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.quota_usage (
    user_id uuid NOT NULL,
    usage_date date NOT NULL,
    kind public.quota_kind NOT NULL,
    used integer DEFAULT 0 NOT NULL,
    allowance integer
);

-- Name: reports; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.reports (
    id bigint NOT NULL,
    reporter_id uuid NOT NULL,
    target_kind public.report_target NOT NULL,
    target_id bigint NOT NULL,
    reason text,
    note text,
    status text DEFAULT 'open'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone
);

-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;

-- Name: sample_answers; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.sample_answers (
    id bigint NOT NULL,
    question_id bigint NOT NULL,
    band numeric(2,1) NOT NULL,
    body_en text NOT NULL,
    notes_vi text,
    audio_url text
);

-- Name: sample_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.sample_answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: sample_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.sample_answers_id_seq OWNED BY public.sample_answers.id;

-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.subscriptions (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    plan_code public.plan_code NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    current_period_end timestamp with time zone,
    canceled_at timestamp with time zone
);

-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;

-- Name: topic_groups; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.topic_groups (
    id bigint NOT NULL,
    part public.ielts_part NOT NULL,
    slug text NOT NULL,
    name_en text NOT NULL,
    name_vi text,
    sort_order integer DEFAULT 0 NOT NULL
);

-- Name: topic_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.topic_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: topic_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.topic_groups_id_seq OWNED BY public.topic_groups.id;

-- Name: user_error_stats; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.user_error_stats (
    user_id uuid NOT NULL,
    error_type_id bigint NOT NULL,
    occurrences integer DEFAULT 0 NOT NULL,
    sample_wrong text,
    sample_correct text,
    last_seen_at timestamp with time zone,
    window_tests integer
);

-- Name: user_goals; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.user_goals (
    user_id uuid NOT NULL,
    target_band numeric(2,1) NOT NULL,
    exam_date date,
    weekly_target_sessions integer DEFAULT 3 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_goals_target_band_check CHECK (((target_band >= (1)::numeric) AND (target_band <= (9)::numeric)))
);

-- Name: user_question_progress; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.user_question_progress (
    user_id uuid NOT NULL,
    question_id bigint NOT NULL,
    attempts_count integer DEFAULT 0 NOT NULL,
    first_band numeric(2,1),
    last_band numeric(2,1),
    best_band numeric(2,1),
    band_delta numeric(3,1),
    percentile integer,
    last_attempt_id bigint,
    last_practiced_at timestamp with time zone,
    is_bookmarked boolean DEFAULT false NOT NULL
);

-- Name: user_recommendations; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.user_recommendations (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    rank integer NOT NULL,
    kind text NOT NULL,
    body_vi text NOT NULL,
    cta_label_vi text,
    target_ref jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    dismissed_at timestamp with time zone
);

-- Name: user_recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.user_recommendations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: user_recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.user_recommendations_id_seq OWNED BY public.user_recommendations.id;

-- Name: user_stats; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.user_stats (
    user_id uuid NOT NULL,
    latest_band numeric(2,1),
    first_band numeric(2,1),
    mock_tests_count integer DEFAULT 0 NOT NULL,
    speaking_ms_total bigint DEFAULT 0 NOT NULL,
    speaking_ms_week bigint DEFAULT 0 NOT NULL,
    forecast_done_count integer DEFAULT 0 NOT NULL,
    forecast_avg_band numeric(2,1),
    bottleneck_criterion public.band_criterion,
    bottleneck_note_vi text,
    refreshed_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Name: user_streaks; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.user_streaks (
    user_id uuid NOT NULL,
    current_days integer DEFAULT 0 NOT NULL,
    longest_days integer DEFAULT 0 NOT NULL,
    current_started_on date,
    last_active_day date
);

-- Name: user_topic_progress; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.user_topic_progress (
    user_id uuid NOT NULL,
    topic_group_id bigint NOT NULL,
    forecast_set_id bigint NOT NULL,
    questions_total integer DEFAULT 0 NOT NULL,
    questions_answered integer DEFAULT 0 NOT NULL,
    avg_band numeric(2,1),
    has_new_question boolean DEFAULT false NOT NULL,
    last_practiced_at timestamp with time zone
);

-- Name: user_vocab; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.user_vocab (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    vocab_item_id bigint NOT NULL,
    source public.vocab_source DEFAULT 'question_panel'::public.vocab_source NOT NULL,
    source_question_id bigint,
    source_attempt_id bigint,
    saved_at timestamp with time zone DEFAULT now() NOT NULL,
    state public.srs_state DEFAULT 'new'::public.srs_state NOT NULL,
    ease numeric(4,2) DEFAULT 2.50 NOT NULL,
    interval_days integer DEFAULT 0 NOT NULL,
    reps integer DEFAULT 0 NOT NULL,
    lapses integer DEFAULT 0 NOT NULL,
    due_on date DEFAULT CURRENT_DATE NOT NULL,
    last_reviewed_at timestamp with time zone
);

-- Name: user_vocab_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.user_vocab_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: user_vocab_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.user_vocab_id_seq OWNED BY public.user_vocab.id;

-- Name: users; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email public.citext NOT NULL,
    password_hash text,
    display_name text NOT NULL,
    handle public.citext,
    avatar_url text,
    locale text DEFAULT 'vi'::text NOT NULL,
    timezone text DEFAULT 'Asia/Ho_Chi_Minh'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_active_at timestamp with time zone
);

-- Name: v_band_history; Type: VIEW; Schema: public; Owner: -

CREATE VIEW public.v_band_history AS
 SELECT m.user_id,
    m.id AS mock_test_id,
    (m.taken_at)::date AS day,
    m.band_overall,
    s.criterion,
    s.band AS criterion_band
   FROM (public.mock_tests m
     LEFT JOIN public.mock_test_scores s ON (((s.mock_test_id = m.id) AND (s.part IS NULL))))
  WHERE (m.status = 'scored'::public.mock_status)
  ORDER BY m.taken_at;

-- Name: v_forecast_board; Type: VIEW; Schema: public; Owner: -

CREATE VIEW public.v_forecast_board AS
 SELECT fq.forecast_set_id,
    q.id AS question_id,
    q.part,
    q.text_en,
    tg.name_en AS topic_group,
    fq.flag,
    fq.appearances_30d,
    fq.probability,
    fq.entered_set_on,
    p.user_id,
    p.attempts_count,
    p.last_band,
    p.last_practiced_at,
    ( SELECT count(*) AS count
           FROM public.questions c
          WHERE (c.parent_question_id = q.id)) AS followups_count
   FROM (((public.forecast_questions fq
     JOIN public.questions q ON ((q.id = fq.question_id)))
     LEFT JOIN public.topic_groups tg ON ((tg.id = q.topic_group_id)))
     LEFT JOIN public.user_question_progress p ON ((p.question_id = q.id)));

-- Name: v_vocab_due_today; Type: VIEW; Schema: public; Owner: -

CREATE VIEW public.v_vocab_due_today AS
 SELECT uv.user_id,
    count(*) AS due_count
   FROM public.user_vocab uv
  WHERE ((uv.due_on <= CURRENT_DATE) AND (uv.state <> 'suspended'::public.srs_state))
  GROUP BY uv.user_id;

-- Name: vocab_items; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.vocab_items (
    id bigint NOT NULL,
    term text NOT NULL,
    ipa text,
    kind public.vocab_kind DEFAULT 'collocation'::public.vocab_kind NOT NULL,
    meaning_vi text NOT NULL,
    meaning_en text,
    example_en text,
    example_vi text,
    audio_url text,
    band_tier integer,
    topic_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT vocab_items_band_tier_check CHECK (((band_tier >= 5) AND (band_tier <= 9)))
);

-- Name: vocab_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.vocab_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: vocab_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.vocab_items_id_seq OWNED BY public.vocab_items.id;

-- Name: vocab_review_sessions; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.vocab_review_sessions (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    finished_at timestamp with time zone,
    cards_total integer DEFAULT 0 NOT NULL,
    cards_known integer DEFAULT 0 NOT NULL,
    next_due_on date
);

-- Name: vocab_review_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.vocab_review_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: vocab_review_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.vocab_review_sessions_id_seq OWNED BY public.vocab_review_sessions.id;

-- Name: vocab_reviews; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.vocab_reviews (
    id bigint NOT NULL,
    session_id bigint NOT NULL,
    user_vocab_id bigint NOT NULL,
    rating public.srs_rating NOT NULL,
    revealed_ms integer,
    reviewed_at timestamp with time zone DEFAULT now() NOT NULL,
    interval_before integer,
    interval_after integer
);

-- Name: vocab_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.vocab_reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: vocab_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.vocab_reviews_id_seq OWNED BY public.vocab_reviews.id;

-- Name: vocab_topics; Type: TABLE; Schema: public; Owner: -

CREATE TABLE public.vocab_topics (
    id bigint NOT NULL,
    slug text NOT NULL,
    name_en text NOT NULL,
    name_vi text,
    blurb_vi text,
    common_parts public.ielts_part[] DEFAULT '{}'::public.ielts_part[] NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);

-- Name: vocab_topics_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE public.vocab_topics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Name: vocab_topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE public.vocab_topics_id_seq OWNED BY public.vocab_topics.id;

-- Name: ai_conversations id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.ai_conversations ALTER COLUMN id SET DEFAULT nextval('public.ai_conversations_id_seq'::regclass);

-- Name: ai_messages id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.ai_messages ALTER COLUMN id SET DEFAULT nextval('public.ai_messages_id_seq'::regclass);

-- Name: attempt_errors id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_errors ALTER COLUMN id SET DEFAULT nextval('public.attempt_errors_id_seq'::regclass);

-- Name: attempt_transcript_spans id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_transcript_spans ALTER COLUMN id SET DEFAULT nextval('public.attempt_transcript_spans_id_seq'::regclass);

-- Name: attempts id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempts ALTER COLUMN id SET DEFAULT nextval('public.attempts_id_seq'::regclass);

-- Name: error_types id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.error_types ALTER COLUMN id SET DEFAULT nextval('public.error_types_id_seq'::regclass);

-- Name: forecast_sets id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.forecast_sets ALTER COLUMN id SET DEFAULT nextval('public.forecast_sets_id_seq'::regclass);

-- Name: mock_test_scores id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.mock_test_scores ALTER COLUMN id SET DEFAULT nextval('public.mock_test_scores_id_seq'::regclass);

-- Name: mock_tests id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.mock_tests ALTER COLUMN id SET DEFAULT nextval('public.mock_tests_id_seq'::regclass);

-- Name: practice_sessions id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.practice_sessions ALTER COLUMN id SET DEFAULT nextval('public.practice_sessions_id_seq'::regclass);

-- Name: question_idea_frames id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.question_idea_frames ALTER COLUMN id SET DEFAULT nextval('public.question_idea_frames_id_seq'::regclass);

-- Name: questions id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);

-- Name: reports id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);

-- Name: sample_answers id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.sample_answers ALTER COLUMN id SET DEFAULT nextval('public.sample_answers_id_seq'::regclass);

-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);

-- Name: topic_groups id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.topic_groups ALTER COLUMN id SET DEFAULT nextval('public.topic_groups_id_seq'::regclass);

-- Name: user_recommendations id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_recommendations ALTER COLUMN id SET DEFAULT nextval('public.user_recommendations_id_seq'::regclass);

-- Name: user_vocab id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_vocab ALTER COLUMN id SET DEFAULT nextval('public.user_vocab_id_seq'::regclass);

-- Name: vocab_items id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_items ALTER COLUMN id SET DEFAULT nextval('public.vocab_items_id_seq'::regclass);

-- Name: vocab_review_sessions id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_review_sessions ALTER COLUMN id SET DEFAULT nextval('public.vocab_review_sessions_id_seq'::regclass);

-- Name: vocab_reviews id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_reviews ALTER COLUMN id SET DEFAULT nextval('public.vocab_reviews_id_seq'::regclass);

-- Name: vocab_topics id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_topics ALTER COLUMN id SET DEFAULT nextval('public.vocab_topics_id_seq'::regclass);

-- Name: ai_conversations ai_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.ai_conversations
    ADD CONSTRAINT ai_conversations_pkey PRIMARY KEY (id);

-- Name: ai_messages ai_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.ai_messages
    ADD CONSTRAINT ai_messages_pkey PRIMARY KEY (id);

-- Name: attempt_errors attempt_errors_attempt_id_seq_no_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_errors
    ADD CONSTRAINT attempt_errors_attempt_id_seq_no_key UNIQUE (attempt_id, seq_no);

-- Name: attempt_errors attempt_errors_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_errors
    ADD CONSTRAINT attempt_errors_pkey PRIMARY KEY (id);

-- Name: attempt_likes attempt_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_likes
    ADD CONSTRAINT attempt_likes_pkey PRIMARY KEY (attempt_id, user_id);

-- Name: attempt_rewrites attempt_rewrites_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_rewrites
    ADD CONSTRAINT attempt_rewrites_pkey PRIMARY KEY (attempt_id);

-- Name: attempt_scores attempt_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_scores
    ADD CONSTRAINT attempt_scores_pkey PRIMARY KEY (attempt_id, criterion);

-- Name: attempt_transcript_spans attempt_transcript_spans_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_transcript_spans
    ADD CONSTRAINT attempt_transcript_spans_pkey PRIMARY KEY (id);

-- Name: attempts attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempts
    ADD CONSTRAINT attempts_pkey PRIMARY KEY (id);

-- Name: daily_vocab_picks daily_vocab_picks_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.daily_vocab_picks
    ADD CONSTRAINT daily_vocab_picks_pkey PRIMARY KEY (user_id, pick_date, vocab_item_id);

-- Name: error_types error_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.error_types
    ADD CONSTRAINT error_types_pkey PRIMARY KEY (id);

-- Name: error_types error_types_slug_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.error_types
    ADD CONSTRAINT error_types_slug_key UNIQUE (slug);

-- Name: examiner_voices examiner_voices_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.examiner_voices
    ADD CONSTRAINT examiner_voices_pkey PRIMARY KEY (code);

-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (follower_id, followee_id);

-- Name: forecast_questions forecast_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.forecast_questions
    ADD CONSTRAINT forecast_questions_pkey PRIMARY KEY (forecast_set_id, question_id);

-- Name: forecast_sets forecast_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.forecast_sets
    ADD CONSTRAINT forecast_sets_pkey PRIMARY KEY (id);

-- Name: forecast_sets forecast_sets_slug_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.forecast_sets
    ADD CONSTRAINT forecast_sets_slug_key UNIQUE (slug);

-- Name: mock_test_scores mock_test_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.mock_test_scores
    ADD CONSTRAINT mock_test_scores_pkey PRIMARY KEY (id);

-- Name: mock_tests mock_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.mock_tests
    ADD CONSTRAINT mock_tests_pkey PRIMARY KEY (id);

-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (code);

-- Name: practice_days practice_days_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.practice_days
    ADD CONSTRAINT practice_days_pkey PRIMARY KEY (user_id, day);

-- Name: practice_sessions practice_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_pkey PRIMARY KEY (id);

-- Name: public_attempts public_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.public_attempts
    ADD CONSTRAINT public_attempts_pkey PRIMARY KEY (attempt_id);

-- Name: question_idea_frames question_idea_frames_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.question_idea_frames
    ADD CONSTRAINT question_idea_frames_pkey PRIMARY KEY (id);

-- Name: question_idea_frames question_idea_frames_question_id_step_no_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.question_idea_frames
    ADD CONSTRAINT question_idea_frames_question_id_step_no_key UNIQUE (question_id, step_no);

-- Name: question_vocab question_vocab_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.question_vocab
    ADD CONSTRAINT question_vocab_pkey PRIMARY KEY (question_id, vocab_item_id, band_tier);

-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);

-- Name: questions questions_slug_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_slug_key UNIQUE (slug);

-- Name: quota_usage quota_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.quota_usage
    ADD CONSTRAINT quota_usage_pkey PRIMARY KEY (user_id, usage_date, kind);

-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);

-- Name: sample_answers sample_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.sample_answers
    ADD CONSTRAINT sample_answers_pkey PRIMARY KEY (id);

-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);

-- Name: topic_groups topic_groups_part_slug_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.topic_groups
    ADD CONSTRAINT topic_groups_part_slug_key UNIQUE (part, slug);

-- Name: topic_groups topic_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.topic_groups
    ADD CONSTRAINT topic_groups_pkey PRIMARY KEY (id);

-- Name: user_error_stats user_error_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_error_stats
    ADD CONSTRAINT user_error_stats_pkey PRIMARY KEY (user_id, error_type_id);

-- Name: user_goals user_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_goals
    ADD CONSTRAINT user_goals_pkey PRIMARY KEY (user_id);

-- Name: user_question_progress user_question_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_question_progress
    ADD CONSTRAINT user_question_progress_pkey PRIMARY KEY (user_id, question_id);

-- Name: user_recommendations user_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_recommendations
    ADD CONSTRAINT user_recommendations_pkey PRIMARY KEY (id);

-- Name: user_stats user_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_pkey PRIMARY KEY (user_id);

-- Name: user_streaks user_streaks_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_streaks
    ADD CONSTRAINT user_streaks_pkey PRIMARY KEY (user_id);

-- Name: user_topic_progress user_topic_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_topic_progress
    ADD CONSTRAINT user_topic_progress_pkey PRIMARY KEY (user_id, topic_group_id, forecast_set_id);

-- Name: user_vocab user_vocab_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_vocab
    ADD CONSTRAINT user_vocab_pkey PRIMARY KEY (id);

-- Name: user_vocab user_vocab_user_id_vocab_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_vocab
    ADD CONSTRAINT user_vocab_user_id_vocab_item_id_key UNIQUE (user_id, vocab_item_id);

-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

-- Name: users users_handle_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_handle_key UNIQUE (handle);

-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Name: vocab_items vocab_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_items
    ADD CONSTRAINT vocab_items_pkey PRIMARY KEY (id);

-- Name: vocab_items vocab_items_term_meaning_vi_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_items
    ADD CONSTRAINT vocab_items_term_meaning_vi_key UNIQUE (term, meaning_vi);

-- Name: vocab_review_sessions vocab_review_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_review_sessions
    ADD CONSTRAINT vocab_review_sessions_pkey PRIMARY KEY (id);

-- Name: vocab_reviews vocab_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_reviews
    ADD CONSTRAINT vocab_reviews_pkey PRIMARY KEY (id);

-- Name: vocab_topics vocab_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_topics
    ADD CONSTRAINT vocab_topics_pkey PRIMARY KEY (id);

-- Name: vocab_topics vocab_topics_slug_key; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_topics
    ADD CONSTRAINT vocab_topics_slug_key UNIQUE (slug);

-- Name: ai_conversations_user_id_last_message_at_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX ai_conversations_user_id_last_message_at_idx ON public.ai_conversations USING btree (user_id, last_message_at DESC);

-- Name: ai_messages_conversation_id_created_at_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX ai_messages_conversation_id_created_at_idx ON public.ai_messages USING btree (conversation_id, created_at);

-- Name: attempt_errors_error_type_id_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX attempt_errors_error_type_id_idx ON public.attempt_errors USING btree (error_type_id);

-- Name: attempt_transcript_spans_attempt_id_char_start_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX attempt_transcript_spans_attempt_id_char_start_idx ON public.attempt_transcript_spans USING btree (attempt_id, char_start);

-- Name: attempts_question_id_band_overall_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX attempts_question_id_band_overall_idx ON public.attempts USING btree (question_id, band_overall DESC) WHERE (status = 'scored'::public.attempt_status);

-- Name: attempts_user_id_question_id_attempt_no_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX attempts_user_id_question_id_attempt_no_idx ON public.attempts USING btree (user_id, question_id, attempt_no);

-- Name: attempts_user_id_recorded_at_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX attempts_user_id_recorded_at_idx ON public.attempts USING btree (user_id, recorded_at DESC);

-- Name: forecast_questions_forecast_set_id_flag_probability_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX forecast_questions_forecast_set_id_flag_probability_idx ON public.forecast_questions USING btree (forecast_set_id, flag, probability DESC);

-- Name: forecast_sets_is_current_idx; Type: INDEX; Schema: public; Owner: -

CREATE UNIQUE INDEX forecast_sets_is_current_idx ON public.forecast_sets USING btree (is_current) WHERE is_current;

-- Name: mock_test_scores_mock_test_id_criterion_idx; Type: INDEX; Schema: public; Owner: -

CREATE UNIQUE INDEX mock_test_scores_mock_test_id_criterion_idx ON public.mock_test_scores USING btree (mock_test_id, criterion) WHERE (part IS NULL);

-- Name: mock_test_scores_mock_test_id_part_criterion_idx; Type: INDEX; Schema: public; Owner: -

CREATE UNIQUE INDEX mock_test_scores_mock_test_id_part_criterion_idx ON public.mock_test_scores USING btree (mock_test_id, part, criterion) WHERE (part IS NOT NULL);

-- Name: mock_tests_retake_of_id_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX mock_tests_retake_of_id_idx ON public.mock_tests USING btree (retake_of_id);

-- Name: mock_tests_user_id_taken_at_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX mock_tests_user_id_taken_at_idx ON public.mock_tests USING btree (user_id, taken_at DESC);

-- Name: practice_sessions_user_id_started_at_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX practice_sessions_user_id_started_at_idx ON public.practice_sessions USING btree (user_id, started_at DESC);

-- Name: public_attempts_question_id_iso_week_band_overall_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX public_attempts_question_id_iso_week_band_overall_idx ON public.public_attempts USING btree (question_id, iso_week, band_overall DESC);

-- Name: questions_parent_question_id_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX questions_parent_question_id_idx ON public.questions USING btree (parent_question_id);

-- Name: questions_part_topic_group_id_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX questions_part_topic_group_id_idx ON public.questions USING btree (part, topic_group_id);

-- Name: reports_target_kind_target_id_status_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX reports_target_kind_target_id_status_idx ON public.reports USING btree (target_kind, target_id, status);

-- Name: sample_answers_question_id_band_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX sample_answers_question_id_band_idx ON public.sample_answers USING btree (question_id, band);

-- Name: subscriptions_user_id_status_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX subscriptions_user_id_status_idx ON public.subscriptions USING btree (user_id, status);

-- Name: user_question_progress_user_id_last_practiced_at_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX user_question_progress_user_id_last_practiced_at_idx ON public.user_question_progress USING btree (user_id, last_practiced_at DESC);

-- Name: user_recommendations_user_id_rank_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX user_recommendations_user_id_rank_idx ON public.user_recommendations USING btree (user_id, rank) WHERE (dismissed_at IS NULL);

-- Name: user_vocab_user_id_due_on_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX user_vocab_user_id_due_on_idx ON public.user_vocab USING btree (user_id, due_on) WHERE (state <> 'suspended'::public.srs_state);

-- Name: user_vocab_user_id_source_question_id_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX user_vocab_user_id_source_question_id_idx ON public.user_vocab USING btree (user_id, source_question_id);

-- Name: vocab_items_to_tsvector_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX vocab_items_to_tsvector_idx ON public.vocab_items USING gin (to_tsvector('simple'::regconfig, term));

-- Name: vocab_items_topic_id_band_tier_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX vocab_items_topic_id_band_tier_idx ON public.vocab_items USING btree (topic_id, band_tier);

-- Name: vocab_reviews_user_vocab_id_reviewed_at_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX vocab_reviews_user_vocab_id_reviewed_at_idx ON public.vocab_reviews USING btree (user_vocab_id, reviewed_at DESC);

-- Name: ai_conversations ai_conversations_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.ai_conversations
    ADD CONSTRAINT ai_conversations_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.attempts(id) ON DELETE SET NULL;

-- Name: ai_conversations ai_conversations_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.ai_conversations
    ADD CONSTRAINT ai_conversations_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE SET NULL;

-- Name: ai_conversations ai_conversations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.ai_conversations
    ADD CONSTRAINT ai_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: ai_messages ai_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.ai_messages
    ADD CONSTRAINT ai_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.ai_conversations(id) ON DELETE CASCADE;

-- Name: attempt_errors attempt_errors_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_errors
    ADD CONSTRAINT attempt_errors_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.attempts(id) ON DELETE CASCADE;

-- Name: attempt_errors attempt_errors_error_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_errors
    ADD CONSTRAINT attempt_errors_error_type_id_fkey FOREIGN KEY (error_type_id) REFERENCES public.error_types(id);

-- Name: attempt_likes attempt_likes_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_likes
    ADD CONSTRAINT attempt_likes_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.public_attempts(attempt_id) ON DELETE CASCADE;

-- Name: attempt_likes attempt_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_likes
    ADD CONSTRAINT attempt_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: attempt_rewrites attempt_rewrites_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_rewrites
    ADD CONSTRAINT attempt_rewrites_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.attempts(id) ON DELETE CASCADE;

-- Name: attempt_scores attempt_scores_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_scores
    ADD CONSTRAINT attempt_scores_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.attempts(id) ON DELETE CASCADE;

-- Name: attempt_transcript_spans attempt_transcript_spans_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempt_transcript_spans
    ADD CONSTRAINT attempt_transcript_spans_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.attempts(id) ON DELETE CASCADE;

-- Name: attempts attempts_mock_test_fk; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempts
    ADD CONSTRAINT attempts_mock_test_fk FOREIGN KEY (mock_test_id) REFERENCES public.mock_tests(id) ON DELETE SET NULL;

-- Name: attempts attempts_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempts
    ADD CONSTRAINT attempts_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);

-- Name: attempts attempts_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempts
    ADD CONSTRAINT attempts_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.practice_sessions(id) ON DELETE SET NULL;

-- Name: attempts attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.attempts
    ADD CONSTRAINT attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: daily_vocab_picks daily_vocab_picks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.daily_vocab_picks
    ADD CONSTRAINT daily_vocab_picks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: daily_vocab_picks daily_vocab_picks_vocab_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.daily_vocab_picks
    ADD CONSTRAINT daily_vocab_picks_vocab_item_id_fkey FOREIGN KEY (vocab_item_id) REFERENCES public.vocab_items(id) ON DELETE CASCADE;

-- Name: follows follows_followee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_followee_id_fkey FOREIGN KEY (followee_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: forecast_questions forecast_questions_forecast_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.forecast_questions
    ADD CONSTRAINT forecast_questions_forecast_set_id_fkey FOREIGN KEY (forecast_set_id) REFERENCES public.forecast_sets(id) ON DELETE CASCADE;

-- Name: forecast_questions forecast_questions_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.forecast_questions
    ADD CONSTRAINT forecast_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

-- Name: mock_test_scores mock_test_scores_mock_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.mock_test_scores
    ADD CONSTRAINT mock_test_scores_mock_test_id_fkey FOREIGN KEY (mock_test_id) REFERENCES public.mock_tests(id) ON DELETE CASCADE;

-- Name: mock_tests mock_tests_retake_of_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.mock_tests
    ADD CONSTRAINT mock_tests_retake_of_id_fkey FOREIGN KEY (retake_of_id) REFERENCES public.mock_tests(id) ON DELETE SET NULL;

-- Name: mock_tests mock_tests_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.mock_tests
    ADD CONSTRAINT mock_tests_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.practice_sessions(id) ON DELETE SET NULL;

-- Name: mock_tests mock_tests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.mock_tests
    ADD CONSTRAINT mock_tests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: mock_tests mock_tests_voice_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.mock_tests
    ADD CONSTRAINT mock_tests_voice_code_fkey FOREIGN KEY (voice_code) REFERENCES public.examiner_voices(code);

-- Name: practice_days practice_days_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.practice_days
    ADD CONSTRAINT practice_days_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: practice_sessions practice_sessions_forecast_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_forecast_set_id_fkey FOREIGN KEY (forecast_set_id) REFERENCES public.forecast_sets(id);

-- Name: practice_sessions practice_sessions_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_groups(id);

-- Name: practice_sessions practice_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: practice_sessions practice_sessions_voice_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_voice_code_fkey FOREIGN KEY (voice_code) REFERENCES public.examiner_voices(code);

-- Name: public_attempts public_attempts_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.public_attempts
    ADD CONSTRAINT public_attempts_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.attempts(id) ON DELETE CASCADE;

-- Name: public_attempts public_attempts_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.public_attempts
    ADD CONSTRAINT public_attempts_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

-- Name: public_attempts public_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.public_attempts
    ADD CONSTRAINT public_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: question_idea_frames question_idea_frames_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.question_idea_frames
    ADD CONSTRAINT question_idea_frames_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

-- Name: question_vocab question_vocab_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.question_vocab
    ADD CONSTRAINT question_vocab_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

-- Name: question_vocab question_vocab_vocab_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.question_vocab
    ADD CONSTRAINT question_vocab_vocab_item_id_fkey FOREIGN KEY (vocab_item_id) REFERENCES public.vocab_items(id) ON DELETE CASCADE;

-- Name: questions questions_parent_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_parent_question_id_fkey FOREIGN KEY (parent_question_id) REFERENCES public.questions(id) ON DELETE SET NULL;

-- Name: questions questions_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_groups(id);

-- Name: quota_usage quota_usage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.quota_usage
    ADD CONSTRAINT quota_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: reports reports_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: sample_answers sample_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.sample_answers
    ADD CONSTRAINT sample_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

-- Name: subscriptions subscriptions_plan_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_plan_code_fkey FOREIGN KEY (plan_code) REFERENCES public.plans(code);

-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: user_error_stats user_error_stats_error_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_error_stats
    ADD CONSTRAINT user_error_stats_error_type_id_fkey FOREIGN KEY (error_type_id) REFERENCES public.error_types(id) ON DELETE CASCADE;

-- Name: user_error_stats user_error_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_error_stats
    ADD CONSTRAINT user_error_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: user_goals user_goals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_goals
    ADD CONSTRAINT user_goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: user_question_progress user_question_progress_last_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_question_progress
    ADD CONSTRAINT user_question_progress_last_attempt_id_fkey FOREIGN KEY (last_attempt_id) REFERENCES public.attempts(id) ON DELETE SET NULL;

-- Name: user_question_progress user_question_progress_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_question_progress
    ADD CONSTRAINT user_question_progress_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

-- Name: user_question_progress user_question_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_question_progress
    ADD CONSTRAINT user_question_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: user_recommendations user_recommendations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_recommendations
    ADD CONSTRAINT user_recommendations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: user_stats user_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: user_streaks user_streaks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_streaks
    ADD CONSTRAINT user_streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: user_topic_progress user_topic_progress_forecast_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_topic_progress
    ADD CONSTRAINT user_topic_progress_forecast_set_id_fkey FOREIGN KEY (forecast_set_id) REFERENCES public.forecast_sets(id) ON DELETE CASCADE;

-- Name: user_topic_progress user_topic_progress_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_topic_progress
    ADD CONSTRAINT user_topic_progress_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_groups(id) ON DELETE CASCADE;

-- Name: user_topic_progress user_topic_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_topic_progress
    ADD CONSTRAINT user_topic_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: user_vocab user_vocab_source_attempt_fk; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_vocab
    ADD CONSTRAINT user_vocab_source_attempt_fk FOREIGN KEY (source_attempt_id) REFERENCES public.attempts(id) ON DELETE SET NULL;

-- Name: user_vocab user_vocab_source_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_vocab
    ADD CONSTRAINT user_vocab_source_question_id_fkey FOREIGN KEY (source_question_id) REFERENCES public.questions(id) ON DELETE SET NULL;

-- Name: user_vocab user_vocab_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_vocab
    ADD CONSTRAINT user_vocab_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: user_vocab user_vocab_vocab_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.user_vocab
    ADD CONSTRAINT user_vocab_vocab_item_id_fkey FOREIGN KEY (vocab_item_id) REFERENCES public.vocab_items(id) ON DELETE CASCADE;

-- Name: vocab_items vocab_items_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_items
    ADD CONSTRAINT vocab_items_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.vocab_topics(id) ON DELETE SET NULL;

-- Name: vocab_review_sessions vocab_review_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_review_sessions
    ADD CONSTRAINT vocab_review_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Name: vocab_reviews vocab_reviews_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_reviews
    ADD CONSTRAINT vocab_reviews_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.vocab_review_sessions(id) ON DELETE CASCADE;

-- Name: vocab_reviews vocab_reviews_user_vocab_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY public.vocab_reviews
    ADD CONSTRAINT vocab_reviews_user_vocab_id_fkey FOREIGN KEY (user_vocab_id) REFERENCES public.user_vocab(id) ON DELETE CASCADE;

-- PostgreSQL database dump complete

\unrestrict dBaflpjAOg2UXIXV3MNyeDC2xnClW1Ttfnat4DNsjoZad7idKBjdrAuR0J9QaQd

