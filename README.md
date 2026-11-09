# Reliant

Reliant is an AI-agent QA workbench for running reproducible datasets against existing agent endpoints, inspecting failures, comparing versions, and exporting evidence.

## Deploy to Vercel

1. Import `https://github.com/Fr3dy03/reliant` into Vercel.
2. Framework preset: **Next.js**.
3. Build command: `npm run build`.
4. Add the environment variable `RELIANT_SECRET_KEY` with a long random value.
5. Deploy.

The repository includes `vercel.json` and `.env.example`, so no custom build configuration is required.

## Important MVP persistence note

The MVP repository uses a JSON persistence adapter. Vercel serverless functions use `/tmp` for writes, and `/tmp` is ephemeral; data can disappear between cold starts or deployments. This is acceptable for a disposable testnet demo, but not production. Before production use, replace `src/lib/runtime.ts` with a PostgreSQL/Drizzle adapter (or another durable database) and add tenant-aware authentication.

## Implementation phases

- **Phase 1 foundation:** environment contracts, wallet nonce lifecycle, and PostgreSQL tenancy schema contract are included in `src/lib/env.ts`, `src/lib/authNonce.ts`, and `src/lib/schema.ts`.
- **Phase 2 database adapter:** typed Drizzle/PostgreSQL tables and a lazy database client are included in `src/lib/dbSchema.ts` and `src/lib/db.ts`; the runtime migration remains the next database step.
- **Phase 3 wallet sessions:** add signed nonce verification and workspace sessions.
- **Phase 4 durable runs:** move experiment execution to a durable queue/worker.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run typecheck
npm test
npm run build
```

## BOT Chain

The optional receipt contract is deployed on Bohr Testnet (chain ID 968). Reliant does not publish prompts, endpoint URLs, inputs, outputs, credentials, PII, or proprietary traces on-chain. A receipt means only that a manifest hash was recorded at a transaction/block; it is not an independent safety certification.