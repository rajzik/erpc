# ERPC

ERPC is an Effect-TS-first, tRPC-inspired monorepo scaffold with a React Query adapter. The current repository provides publishable package boundaries, shared contracts, and compileable skeleton implementations rather than a complete RPC runtime.

## Workspace

- `@erpc/core`: router, procedure, envelope, and inference primitives
- `@erpc/server`: Effect-based procedure execution and HTTP handler scaffolding
- `@erpc/client`: typed client and transport contracts
- `@erpc/query`: React Query integration on top of `@erpc/client`

## Toolchain

- Node 22
- `pnpm` 10 via Corepack

## Commands

- `pnpm install`
- `pnpm build`
- `pnpm lint`
- `pnpm format`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm check`

## Notes

The initial scaffold is intentionally minimal. It focuses on package structure, type contracts, build outputs, export maps, and test coverage for the package graph.
