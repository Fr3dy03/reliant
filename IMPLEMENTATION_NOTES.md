# Reliant implementation notes

## Architecture
- Next.js App Router + TypeScript + Tailwind-style CSS tokens.
- MVP persistence uses a file-backed tenant-scoped repository (`src/lib/runtime.ts`) seeded with a clearly labeled DEMO workspace. Locally it uses `.reliant-data.json`; on Vercel it uses ephemeral `/tmp/reliant-data.json`. The repository interface is intentionally shaped for a PostgreSQL/Drizzle adapter.
- Run execution calls the local fixture endpoint and evaluates cases synchronously inside the MVP API route. Production deployment should move this implementation to a Postgres-backed queue or BullMQ worker process.
- Evaluation engine is pure and deterministic (`src/lib/evaluators.ts`). Endpoint safety and redaction are pure utilities with tests.
- API routes expose project/run/export actions. UI is server-rendered with client interactions kept small and keyboard accessible.
- BOT receipts are feature-flagged and not exercised by default; only a manifest hash would be publishable.

## Milestones
1. Visual system, responsive shell, overview, runs, datasets, connections, evaluators, settings routes.
2. Tenant-aware project/run repository and demo fixture.
3. Deterministic evaluator engine, comparison summaries, export.
4. SSRF validation, redaction, retry/idempotency tests.
5. Production follow-up: Auth.js, encrypted secret vault, PostgreSQL migrations, isolated worker, OpenTelemetry ingestion, viem receipt publisher, Playwright acceptance suite.

## Security boundaries
- Production endpoint calls must use HTTPS, reject private/link-local/metadata destinations, re-check DNS on connect, disable unrestricted redirects, cap body/response sizes, and never log auth headers.
- Secrets are masked at the UI boundary. This demo does not persist secrets and therefore does not claim encryption at rest.
- Run output is tenant-scoped by repository access checks. No score is a safety certification.