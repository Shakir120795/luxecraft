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
- [ ] Finalize email provider (transactional emails wired to BullMQ queue — provider TBD)
- [ ] Finalize OTP provider (OTP generation done; delivery provider TBD)
- [ ] Finalize analytics strategy
- [ ] Finalize object storage provider
- [ ] Finalize return/refund policy
- [ ] Finalize shipping policy
- [x] Finalize admin access: initial Super Admin / Owner only

## Scope Lock

- [x] Core requirements discussed and locked
- [x] Admin role scope locked to Super Admin initially
- [x] Future staff roles explicitly deferred (RBAC-ready architecture in place)

---

## Phase 1 — Project Foundation & Infrastructure ✅ COMPLETE

- [x] Repository structure (`.ai/` docs, root files)
- [x] Git with `.gitignore` and `.gitattributes`
- [x] Environment configuration (`.env.example`)
- [x] Docker Compose (PostgreSQL 16 + Redis 7)
- [x] Next.js storefront (`apps/storefront`)
- [x] Next.js admin (`apps/admin`)
- [x] NestJS API (`apps/api`)
- [x] Prisma schema foundation
- [x] Prisma client generation
- [x] Redis module (ioredis)
- [x] BullMQ queue foundation (4 queues)
- [x] Health endpoint (`GET /api/v1/health`)
- [x] Cross-platform command runner
- [x] Typecheck / lint / build (all pass)
- [x] Pushed to GitHub `origin/main`
- [ ] Runtime DB/Redis verification — blocked by Docker Desktop not running

---

## Phase 2 — Authentication & Secure Admin Foundation ✅ COMPLETE

- [x] Dependencies: @nestjs/jwt, @nestjs/passport, passport-jwt, bcrypt, @nestjs/throttler, helmet, cookie-parser
- [x] Prisma schema: User, Session, OtpCode, PasswordResetToken, LoginAttempt, AdminUser, AdminSession, AuditLog
- [x] Prisma client regenerated
- [x] UsersModule: create, find, verify password, mark verified, update password
- [x] OtpModule: crypto-random OTP, TTL, max-attempts, invalidation
- [x] AuditModule: fire-and-forget log writer, paginated reader
- [x] Customer auth: register, login, logout, refresh, logout-all
- [x] Customer auth: email verification + OTP
- [x] Customer auth: forgot-password / reset-password (no email enumeration)
- [x] Customer auth: JWT strategy (separate secret, 15 min access token)
- [x] Customer auth: refresh token rotation (30-day sessions)
- [x] Customer auth: login attempt tracking + lockout (10 failures / 15 min)
- [x] Admin auth: separate module, separate JWT secret, 8h access token
- [x] Admin auth: account lockout after 5 failures (30 min)
- [x] Admin auth: login/logout audit logged
- [x] Admin auth: refresh token rotation (7-day sessions)
- [x] Admin auth: create-admin endpoint (Super Admin only)
- [x] Guards: JwtAuthGuard, OptionalJwtAuthGuard, AdminJwtAuthGuard, SuperAdminGuard
- [x] Decorators: @CurrentUser(), @CurrentAdmin(), @Public()
- [x] AuditInterceptor for admin mutation routes
- [x] Helmet security headers
- [x] Global ThrottlerGuard (100 req/60s)
- [x] Seed script: creates initial Super Admin from env vars
- [x] Typecheck / lint / build (all pass — 0 errors, 0 warnings)
- [x] Pushed to GitHub `origin/main`
- [ ] Runtime migration + seed — blocked by Docker Desktop not running

---

## Phase 3 — Catalog, Products, Categories & Inventory ✅ COMPLETE

- [x] Dependencies: slugify
- [x] Prisma schema: Category, Product, ProductVariant, ProductMedia, ProductCustomizationOption, InventoryLog + enums
- [x] Prisma client regenerated
- [x] Slug utility: auto-generation with collision detection
- [x] CategoriesModule: create, edit, hide, archive, restore, soft-delete, reorder
- [x] Categories: image URL + optional storage key
- [x] Categories: description, SEO metadata
- [x] Initial categories ready: Hand Knotted Rugs, Hand Tufted Rugs, Flat Weave Rugs, Craft & Statue (schema supports creation)
- [x] ProductsModule: create, edit, publish, hide, archive, restore, soft-delete
- [x] Products: SKU, description, short description, regular/sale price, status
- [x] Products: SEO data (title, description, slug auto-generated)
- [x] Products: media CRUD (upload key + URL, multiple images, isMain flag, sortOrder, alt text)
- [x] Products: variants CRUD (SKU, price overrides, stock, weight, dimensions, availability, soft-delete)
- [x] Products: customization options CRUD (groupName, optionLabel, priceDelta, sortOrder)
- [x] InventoryModule: stock quantity, available/reserved stock, variant-level
- [x] Inventory: low-stock threshold per variant, low-stock detection endpoint
- [x] Inventory: manual adjustment with audit trail
- [x] Inventory: reserve/release/deduct flow for order processing
- [x] Admin API: full CRUD for categories, products, variants, media, customization, inventory
- [x] Storefront API: public product listing (filter by category, featured, search), product detail by slug, category tree
- [x] Separate admin + public controllers for clean ACL boundary
- [x] Typecheck / lint / build (all pass — 0 errors, 0 warnings)
- [x] Pushed to GitHub `origin/main`
- [ ] Runtime migration + seed — blocked by Docker Desktop not running

---

## Phase 4 — Cart, Checkout & Orders

Waiting for explicit instruction to begin Phase 4.

## Phases 5–9

Deferred — see `.ai/DEVELOPMENT_PHASES.md` for full plan.
