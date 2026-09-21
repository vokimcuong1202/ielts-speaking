-- Learner's own sample answer per question (answer support panel, "Ghi chú").
CREATE TABLE public.user_question_notes (
    user_id     uuid        NOT NULL,
    question_id bigint      NOT NULL,
    body        text        NOT NULL,
    updated_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_question_notes_pkey PRIMARY KEY (user_id, question_id),
    CONSTRAINT user_question_notes_body_check CHECK (length(btrim(body)) > 0),
    CONSTRAINT user_question_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT user_question_notes_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE
);
