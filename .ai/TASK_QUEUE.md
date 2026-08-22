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

## Phase 4 — Cart & Wishlist ✅ COMPLETE

- [x] Prisma schema: Cart, CartItem, Wishlist, WishlistItem models
- [x] Cart supports guest (sessionId) + customer (userId)
- [x] Guest cart: 30-day TTL, auto-expires
- [x] Customer cart: persistent, linked to userId
- [x] CartModule: add/update/remove items, clear cart, calculate totals
- [x] Cart merge on login: seamlessly combines guest + customer carts
- [x] Price snapshot: stores price at add-to-cart time
- [x] Customization support: JSON field for selected options
- [x] WishlistModule: customer-only (JwtAuthGuard)
- [x] Wishlist: add/remove/toggle, clear, check if item present
- [x] Move to cart: direct wishlist → cart transfer
- [x] Unique constraint: prevents duplicate product+variant in wishlist
- [x] Cart routes: 7 endpoints with OptionalJwtAuthGuard
- [x] Wishlist routes: 7 endpoints with JwtAuthGuard
- [x] Typecheck / lint / build (all pass — 0 errors, 0 warnings)
- [x] Pushed to GitHub `origin/main`
- [ ] Runtime migration + seed — blocked by Docker Desktop not running

---

## Phase 5 — Checkout, Payments, Shipping & Orders ✅ COMPLETE

- [x] Prisma schema: Address, ShippingZone, ShippingMethod, TaxRule, Order, OrderItem, Payment + 5 enums
- [x] AddressesModule: customer address CRUD, billing/shipping types, default management
- [x] ShippingModule: zone configuration, method rates, flexible pricing (base + weight + free-ship threshold)
- [x] TaxModule: country/region tax rules, VAT/GST support, inclusive/exclusive pricing
- [x] OrdersModule: create order from checkout, order snapshots (preserve product/price/customization)
- [x] OrdersModule: status management (order, payment, fulfillment enums)
- [x] PaymentsModule: provider abstraction (provider field, providerPaymentId, refunds)
- [x] CheckoutModule: orchestrates cart → address → shipping → tax → order → payment flow
- [x] Customer routes: /api/v1/addresses (CRUD), /api/v1/orders (list/detail)
- [x] All modules registered in AppModule
- [x] Prisma client regenerated
- [x] Typecheck / lint / build (all pass — 0 errors, 8 warnings minor)
- [x] Pushed to GitHub `origin/main`
- [ ] Runtime migration + seed — blocked by Docker Desktop not running

### Phase 5 Routes (16 new endpoints)

**Address Management (5):**
- `POST /api/v1/addresses` — create address
- `GET /api/v1/addresses` — list user addresses
- `GET /api/v1/addresses/:id` — get address detail
- `PATCH /api/v1/addresses/:id` — update address
- `DELETE /api/v1/addresses/:id` — delete address

**Order Management (2):**
- `GET /api/v1/orders` — list user orders
- `GET /api/v1/orders/:id` — get order detail

**Checkout Orchestration (service layer, not yet exposed as routes):**
- `CheckoutService.initiateCheckout()` — validate cart, return checkout state
- `CheckoutService.calculateCheckoutTotals()` — compute final price with tax + shipping
- `CheckoutService.createOrderFromCheckout()` — creates order + payment from checkout data

**Internal Services (no routes, used by CheckoutModule):**
- `ShippingService.calculateShippingRate()` — get rates for country + weight + order value
- `ShippingService.findAvailableMethods()` — list available shipping methods for country
- `TaxService.calculateTax()` — compute tax amount based on country/region + amount
- `OrdersService.updateStatus()` — update order/payment/fulfillment status
- `OrdersService.findAll()` — admin order listing (status filtering, pagination)
- `PaymentsService.refund()` — process refund (full + partial)

---

## Phase 6 — Luxury Custom Design Order Engine ✅ COMPLETE

- [x] Prisma schema: CustomRequest, CustomMessage, CustomQuote, CustomDesign + 4 enums
- [x] CustomRequestsModule: customer create/list/detail, auto-generated CR-XXXXXX numbers
- [x] CustomMessagesModule: messaging, attachments, read/unread state, threaded by request
- [x] CustomQuotesModule: quote creation with version tracking (v1, v2, etc.), customer accept/decline
- [x] CustomDesignsModule: design upload, versioning, approval workflow (pending/approved/rejected/revision)
- [x] OrdersModule extended: support custom orders (orderType=CUSTOM, no cart items)
- [x] CheckoutModule extended: createOrderFromCustomDesign() finalizes approved design as order
- [x] All modules registered in AppModule
- [x] Prisma client regenerated
- [x] Typecheck / lint / build (all pass — 0 errors, 12 warnings minor)
- [x] Pushed to GitHub `origin/main`
- [ ] Runtime migration + seed — blocked by Docker Desktop not running

### Phase 6 Routes (3 customer-facing + 10 internal services)

**Custom Design Workflow:**
- `POST /api/v1/custom-requests` — customer submit design request
- `GET /api/v1/custom-requests` — list user requests
- `GET /api/v1/custom-requests/:id` — view request + all messages/quotes/designs

**Internal Services (no routes, used by CheckoutModule):**
- `CustomMessagesService.create()` — add message (CUSTOMER/ADMIN/SYSTEM)
- `CustomMessagesService.markAsRead()` — update read status
- `CustomQuotesService.create()` — admin create quote version (auto-numbered QT-XXXXXX)
- `CustomQuotesService.customerAcceptQuote()` — customer accept
- `CustomQuotesService.customerRejectQuote()` — customer reject
- `CustomQuotesService.customerRequestRevision()` — request revision
- `CustomDesignsService.create()` — upload design file with versioning
- `CustomDesignsService.approve()` — lock design for checkout
- `CustomDesignsService.reject()` — reject with reason
- `CustomDesignsService.requestRevision()` — request redesign
- `CheckoutService.createOrderFromCustomDesign()` — convert approved design to CUSTOM order

---

## Phase 7 — Business & Admin Management

Waiting for explicit instruction to begin Phase 7.

### Phase 7 Scope (locked in PROJECT_SPEC.md)
- Admin dashboard: orders, revenue, customers, alerts
- Customer management: profiles, activity, order history
- Order management: search, filter, status, cancellation, refunds
- Custom order management: requests, messages, quotes, designs
- Payment records: view, refunds, webhook logs
- Inventory management: stock, adjustments, alerts
- CMS: homepage sections, banners, featured products
- Coupons: create/edit, discounts, restrictions, expiry
- Reviews: approve, hide, remove, feature
- Notifications: customer and admin triggers
- Audit logs: action history with snapshots

## Phases 8–9

Deferred — see `.ai/DEVELOPMENT_PHASES.md` for full plan.
