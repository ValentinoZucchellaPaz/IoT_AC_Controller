# AGENTS.md — sof-eng-2026-runtime-terror

**Team:** Runtime Terror · **Jira prefix:** `SCRUM` · **Git workflow:** Simplified Gitflow (`feature/SCRUM-N-*` → `development` → `master`)

## Architecture

IoT system: **ESP32** → MQTT → **NestJS backend** → **PostgreSQL** → **Next.js frontend**

```
firmware/esp32/       PlatformIO (Arduino), ArduinoJson, DHT, PubSubClient
backend/nestjs/       NestJS 11, TypeORM, PostgreSQL, MQTT microservice, Swagger
frontend/dashboard/   Next.js 16 (App Router), shadcn/ui, Recharts, Chart.js, Vitest
docker/               docker-compose.yml: postgres:16-alpine + eclipse-mosquitto:2
```

Only **NestJS** backend is active (Flask/Spring Boot directories do not exist).

## Quickstart

```bash
cp .env.example .env                  # single root .env drives everything
cd docker && docker compose up -d     # PostgreSQL :5433, MQTT :1883
cd backend/nestjs && npm install && npm run dev
cd frontend/dashboard && npm install && npm run dev
```

## Commands

| Scope | Command | Notes |
|-------|---------|-------|
| Root | `npm install` | Activates Husky hooks |
| Backend | `npm run dev` | `nest start --watch`, port 3000 |
| Backend | `npm test` | Jest, `*.spec.ts` in `src/` |
| Backend | `npm run lint` | ESLint flat config + Prettier |
| Backend | `npm run format` | Prettier |
| Backend | `npm run mqtt:seed` | Publish fake MQTT data for offline testing |
| Frontend | `npm run dev` | Next.js dev server, port 3000 (may conflict with backend) |
| Frontend | `npm test` | Vitest |
| Frontend | `npm run build` | Next.js build (standalone output) |
| Firmware | `pio test -e native_test` | Unit tests (GoogleTest) |
| Firmware | `pio run -t upload` | Flash ESP32 |
| Docker | `docker compose exec postgres psql -U soft_eng_user -d soft_eng_db` | DB CLI |

## Ports & Connections

- **PostgreSQL** host port **5433** (container 5432), credentials in root `.env`
- **MQTT** host port **1883**
- **Backend** NestJS: default 3000
- **Frontend** Next.js rewrites `/api/*` → `http://localhost:3000/*` (backend)
- **NEXT_PUBLIC_API_URL** in `.env` must match backend port (e.g. `http://localhost:3000`)

## Git & Commit Rules

- **Required format:** `<type>(SCRUM-N): <description>` (e.g. `feat(SCRUM-4): add data ingestion endpoint`)
  - Types: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `style`, `ci`
  - Description: imperative, lowercase, no period, ≤72 chars, English
  - Scope (Jira key) is mandatory — enforced by commitlint
- **Husky hooks:** `pre-commit` runs ESLint on `backend/nestjs`; `pre-push` runs `npm run build` on backend; `commit-msg` validates format
- **Branch naming:** `feature/SCRUM-N-desc` or `hotfix/SCRUM-N-desc`
- **No direct pushes** to `master` or `development` — only merge via PR with ≥2 approvals
- CI runs on PRs to `development`/`master`: backend lint+test, frontend build+test (GitHub Actions)

## Key Implementation Details

- **Observer pattern:** `frontend/dashboard/src/observer/` (history-store, history-store-instance)
- **Strategy pattern:** `backend/nestjs/src/processing/strategies/`
- **Backend entities:** `ProcessedSensorData`, `HealthSensorData` (TypeORM with `synchronize: true`)
- **API spec:** `docs/payload.md` (MQTT topic `sensor/datos`, REST endpoints `/data/last`, `/data/history/{period}`)
- **Swagger:** available at `/api` on the NestJS backend
- **MQTT ingestion:** backend subscribes as MQTT microservice via `@nestjs/microservices`
- **Firmware envs:** `esp32dev` (hardware) and `native_test` (host, GoogleTest)
- **Node version:** 22 LTS (`.nvmrc` in both `backend/nestjs` and `frontend/dashboard`)
- **Code in English** (comments, identifiers, types); docs can be Spanish

## Testing Prerequisites

- Backend tests: no external services needed (Jest, mocked)
- Frontend tests: Vitest, no browser needed
- Firmware tests: `pio test -e native_test` (native host, no ESP32 required)
- End-to-end demo needs Docker (PostgreSQL + MQTT), backend, and frontend running
