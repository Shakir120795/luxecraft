# Task Queue

## Requirements Finalization

- [ ] Finalize brand/project name
- [ ] Finalize product/category structure
- [ ] Finalize customization rules
- [ ] Finalize custom design pricing model
- [ ] Finalize supported countries
- [ ] Finalize currencies
- [ ] Finalize payment provider(s)
- [ ] Finalize shipping provider(s)
- [ ] Finalize tax/VAT approach
- [ ] Finalize email provider
- [ ] Finalize OTP provider
- [ ] Finalize analytics strategy
- [ ] Finalize object storage provider
- [ ] Finalize return/refund policy
- [ ] Finalize shipping policy
- [x] Finalize admin access: initial Super Admin / Owner only

## Scope Lock

- [x] Core requirements discussed and locked
- [x] Admin role scope locked to Super Admin initially
- [x] Future staff roles explicitly deferred

## Phase 1 — Project Foundation & Infrastructure

- [x] Create repository structure (`.ai/` docs, root files)
- [x] Initialize Git with `.gitignore` and `.gitattributes`
- [x] Create environment configuration (`.env.example`)
- [x] Create Docker Compose (PostgreSQL + Redis)
- [x] Bootstrap Next.js storefront (`apps/storefront`)
- [x] Bootstrap Next.js admin (`apps/admin`)
- [x] Bootstrap NestJS API (`apps/api`)
- [x] Configure Prisma schema foundation
- [x] Generate Prisma client
- [x] Configure Redis module (ioredis)
- [x] Configure BullMQ queue foundation (4 queues)
- [x] Create health endpoint (`GET /api/v1/health`)
- [x] Create cross-platform project command runner
- [x] Typecheck all apps (pass)
- [x] Lint all apps (pass)
- [x] Production builds (pass)
- [x] Push to GitHub `origin/main`
- [ ] Verify runtime with Docker (PostgreSQL + Redis running) — blocked by Docker Desktop not running
- [ ] Run Prisma migration (`npm run db:migrate:dev`) — blocked by Docker

## Phase 2 — Authentication & Secure Admin Foundation

Waiting for explicit instruction to begin Phase 2.

- [ ] Customer: registration, login, logout
- [ ] Customer: password hashing (bcrypt)
- [ ] Customer: email verification foundation
- [ ] Customer: OTP foundation
- [ ] Customer: password reset
- [ ] Customer: session management (JWT)
- [ ] Customer: guest checkout foundation
- [ ] Customer: rate limiting
- [ ] Customer: bot/risk protection foundation
- [ ] Admin: separate authentication boundary
- [ ] Admin: Super Admin / Owner only
- [ ] Admin: protected admin routes
- [ ] Admin: secure sessions (separate JWT)
- [ ] Admin: login attempt protection
- [ ] Admin: session expiration/invalidation
- [ ] Admin: 2FA-ready architecture
- [ ] Admin: audit log foundation
- [ ] Security: authorization guards
- [ ] Security: CORS strategy
- [ ] Security: CSRF strategy
- [ ] Security: security headers
- [ ] Security: input validation

## Phase 3 — Catalog, Products, Categories & Inventory

Deferred — awaiting Phase 2 completion.

## Phases 4–9

Deferred — see `.ai/DEVELOPMENT_PHASES.md` for full plan.
