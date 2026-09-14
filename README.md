# English Speaking AI

AI-powered English speaking practice platform: record → transcribe (Deepgram) → evaluate (LLM) → score, with per-user quota tracking.

## Stack

- **apps/web** — Next.js (App Router) frontend
- **apps/api** — NestJS backend (REST API + BullMQ workers)
- **database** — Prisma schema, migrations, seed data
- **packages/shared-types** — types shared between web and api

## Getting started

```bash
pnpm install
cp .env.example .env
docker compose up -d        # postgres, redis, minio
pnpm db:migrate
pnpm dev
```

See [docs/architecture](docs/architecture) for the system design, speaking pipeline, scoring, and quota model.
