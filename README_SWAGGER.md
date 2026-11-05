# Swagger / OpenAPI

This project now includes a minimal OpenAPI (Swagger) spec and Swagger UI.

## How to view locally

- Install dependencies: `pnpm install`
- Start in dev mode (recommended): `pnpm run dev` (generates the OpenAPI document before starting)
- Or build and start: `pnpm run build` then `pnpm start` (the build generates the document)

Open the Swagger UI at: http://localhost:PORT/docs (PORT from your env or default in your config)

Open raw OpenAPI JSON at: http://localhost:PORT/docs.json

To regenerate the document manually after changing routes or validation schemas, run `pnpm generate:openapi`. It writes `generated/openapi.auto.json`.

The generated OpenAPI document is intentionally partial: route and schema details may need manual review and extension.
