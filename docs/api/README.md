# API Contracts

Placeholder for OpenAPI/REST contract docs. Endpoints implemented so far:

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /auth/register | - | Create account, returns JWT |
| POST | /auth/login | - | Returns JWT |
| GET | /users/me | JWT | Current user |
| GET | /exercises | JWT | List exercises |
| POST | /exercises | JWT | Create exercise |
| POST | /practice-sessions | JWT | Create session, enqueues transcription+evaluation |
| GET | /practice-sessions/history | JWT | User's past sessions |
| GET | /practice-sessions/:id | JWT | Session + transcript + evaluation |
| GET | /quota/me | JWT | Current quota usage |
| POST | /audio/upload | JWT | Upload raw audio, returns storage URL |
