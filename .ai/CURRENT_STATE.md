# Current State

## Project Status

Phase: **PHASE 2 COMPLETE — Authentication & Secure Admin Foundation**

Phase 1 and Phase 2 are verified and pushed to `origin/main`.

---

## Phase 2 Summary

### Dependencies Added (`apps/api`)
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` — JWT auth
- `bcrypt` — password hashing (12 rounds)
- `@nestjs/throttler` — global rate limiting
- `helmet` — security headers
- `cookie-parser` — cookie support

### Prisma Schema (extended)
Models added:
- `User` — customer accounts (email, passwordHash, status, timestamps)
- `Session` — customer refresh-token sessions (rotation-based)
- `OtpCode` — email verification / checkout / login OTP codes
- `PasswordResetToken` — 1-hour password reset tokens
- `LoginAttempt` — tracks failures for rate-limit lockout
- `AdminUser` — separate admin accounts (SUPER_ADMIN role, lockout, 2FA-ready)
- `AdminSession` — admin refresh-token sessions (7-day TTL)
- `AuditLog` — linked to AdminUser, records all important events

### Backend Modules Added

| Module | Purpose |
|---|---|
| `UsersModule` | Customer CRUD, password verify, sanitize |
| `OtpModule` | Crypto-random OTP gen/verify, max-attempts, invalidation |
| `AuditModule` | Fire-and-forget audit log writer + paginated reader |
| `AuthModule` | Customer register/login/logout/refresh/verify-email/forgot-password/reset-password |
| `AdminAuthModule` | Separate admin login/logout/refresh with lockout, separate JWT secret |

### Customer Auth Routes (`/api/v1/auth/...`)
- `POST /register` — create account, trigger OTP email (BullMQ-ready)
- `POST /login` — login with lockout check, issues access + refresh tokens
- `POST /refresh` — rotate refresh token, issue new access token
- `POST /logout` — revoke single session
- `POST /logout-all` — revoke all sessions for user (requires JWT)
- `POST /verify-email` — consume OTP, mark email verified
- `POST /resend-verification` — regenerate OTP
- `POST /forgot-password` — generate reset token (no email enumeration)
- `POST /reset-password` — consume token, set new password
- `GET  /me` — return authenticated user profile (requires JWT)

### Admin Auth Routes (`/api/v1/admin/auth/...`)
- `POST /login` — hardened login: lockout after 5 failures (30 min), audit logged
- `POST /refresh` — rotate admin refresh token
- `POST /logout` — revoke session, audit logged
- `GET  /me` — return authenticated admin profile
- `POST /create-admin` — create new admin (requires existing Super Admin JWT)

### Guards & Decorators
- `JwtAuthGuard` — protects customer routes
- `OptionalJwtAuthGuard` — attaches user if present (guest-accessible routes)
- `AdminJwtAuthGuard` — protects admin routes (separate strategy/secret)
- `SuperAdminGuard` — role check (RBAC-ready for future roles)
- `@CurrentUser()` — extracts authenticated customer from request
- `@CurrentAdmin()` — extracts authenticated admin from request
- `@Public()` — marks route as skipping global auth (future use)
- `AuditInterceptor` — auto-logs admin mutations

### Security
- **Helmet** — security headers including CSP
- **ThrottlerGuard** — global 100 req/60s rate limit
- **Login lockout** — 10 failures/15 min for customers, 5 failures/30 min for admins
- **Separate JWT secrets** — `JWT_SECRET` vs `ADMIN_JWT_SECRET`
- **Refresh token rotation** — old token revoked on each use
- **No email enumeration** — forgot-password and resend always return success
- **bcrypt 12 rounds** — customer and admin passwords
- **CORS** — explicit allowed origins list, credentials enabled

### Database Seed
- Creates initial Super Admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars

---

## Verification Results (Phase 2)

| Check | Result |
|---|---|
| API typecheck | ✅ PASS |
| Storefront typecheck | ✅ PASS |
| Admin typecheck | ✅ PASS |
| API lint | ✅ PASS — 0 errors, 0 warnings |
| Storefront lint | ✅ PASS |
| Admin lint | ✅ PASS |
| API production build | ✅ PASS |
| Storefront production build | ✅ PASS |
| Admin production build | ✅ PASS |
| Prisma client generation | ✅ PASS |
| Prisma schema SQL diff | ✅ PASS — valid SQL generated |
| NestJS module bootstrap | ✅ PASS — all modules loaded |
| Routes mapped | ✅ 22 routes (10 customer auth + 5 admin auth + 2 health + 5 from Phase 1) |
| PostgreSQL connection | ⚠️ BLOCKED — Docker not running |
| Prisma migration apply | ⚠️ BLOCKED — requires PostgreSQL |
| Redis connection | ⚠️ BLOCKED — Docker not running |

---

## Blockers (unchanged from Phase 1)

Docker Desktop installed but not running. To complete runtime verification:
1. Start Docker Desktop
2. `npm run docker:up`
3. `npm run db:migrate:dev`
4. `npm run db:seed`
5. `npm run dev:api`
6. `npm run health`

---

## Next Step

Phase 3: Catalog, Products, Categories & Inventory

Do not start Phase 3 until explicitly instructed.

---

## Confirmed Requirements (unchanged)

- Worldwide ecommerce platform
- Premium storefront + admin panel
- Product/category management with media (upload + URL)
- Product variants, inventory, customization
- Bespoke custom design request workflow
- Customer/admin messaging
- Admin-controlled quotes + design approvals
- Cart, checkout, guest checkout
- Payments (provider-agnostic)
- Worldwide shipping + taxes
- Orders, returns, refunds
- Customer profiles + analytics
- Homepage/CMS, SEO, reviews, wishlist, coupons
- Super Admin / Owner role (initial)
- Audit logs
- API-first for future iOS/Android
- Docker, cloud/VPS portable
- PostgreSQL + Prisma + Redis + BullMQ
