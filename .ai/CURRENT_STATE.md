# Current State

## Project Status

Phase: **PHASE 7 COMPLETE — Business & Admin Management**

Phase 1–6 and Phase 7 are verified and pushed to `origin/main`.

---

## Phase 7 Summary

### Prisma Schema (extended)
Models added (3 total):
- `Coupon` — percentage/fixed discounts, restrictions (product/category), min order, expiry, usage limits
- `Review` — product reviews (rating 1-5, status: PENDING/APPROVED/HIDDEN/REJECTED, featured flag)
- `Notification` — customer/admin notifications (type, read/unread, related resource link)

### Backend Modules Added (10 total)

| Module | Purpose | Routes |
|---|---|---|
| `AdminDashboardModule` | Today stats (orders, revenue, customers), alerts, recent orders, top products | 4 GET endpoints |
| `AdminCustomersModule` | Customer profiles, search/filter, order history, total spent, status management | 3 endpoints |
| `AdminOrdersModule` | Order search/filter, view, status updates, cancellation, refunds | 5 endpoints |
| `AdminCustomOrdersModule` | Custom request list/detail, status management | 3 endpoints |
| `AdminPaymentsModule` | Payment records, status view | 2 GET endpoints |
| `AdminInventoryModule` | Low-stock alerts, history, manual adjustments with audit | 3 endpoints |
| `AdminCmsModule` | CMS placeholder (Phase 7 extension ready) | – |
| `AdminCouponsModule` | Coupon CRUD, activation/deactivation | – |
| `AdminReviewsModule` | Review approval/rejection/hiding/featuring | – |
| `AdminNotificationsModule` | Send notifications, mark read, retrieve by recipient | – |

### Routes (22 admin-only + internal services)

All admin routes guarded by `AdminJwtAuthGuard` and prefix `/admin/`:
- `/admin/dashboard/stats` — GET today's stats + alerts
- `/admin/dashboard/recent-orders` — GET recent orders
- `/admin/dashboard/top-products` — GET top products
- `/admin/dashboard/order-stats` — GET order status breakdown
- `/admin/customers` — GET/PATCH customer list, search, detail, status updates
- `/admin/orders` — GET/PATCH/POST order list, search, detail, status, cancel, refund
- `/admin/custom-orders/requests` — GET/PATCH custom requests and status
- `/admin/payments` — GET payment records by status
- `/admin/inventory/low-stock` — GET low-stock alerts
- `/admin/inventory/:variantId/history` — GET inventory change history
- `/admin/inventory/:variantId/adjust` — POST manual adjustment

Internal services (no routes):
- `AdminCouponsService` — coupon CRUD
- `AdminReviewsService` — review approval/rejection/featuring
- `AdminNotificationsService` — send notifications, retrieve, mark read

### Features
- **Dashboard** — real-time KPIs (today's orders, revenue, new customers, alerts)
- **Order management** — search, filter by status, bulk updates, cancellation, refunds
- **Custom order workflow** — request tracking, message/quote/design review
- **Payment tracking** — view payment status, refund history
- **Inventory control** — low-stock alerts, adjustment history with audit trail
- **Customer profiles** — search by email/name, order history, total spent, status control
- **Review moderation** — approve/reject/hide/feature
- **Notification system** — event-driven notifications (read/unread tracking)
- **Audit ready** — all admin actions logged with before/after snapshots

### Design Decisions (Phase 7)
- **Admin-only routes** — all admin functionality behind AdminJwtAuthGuard (separate from customer auth)
- **Dashboard KPIs** — aggregated from database (no external analytics dependencies)
- **Service-layer services** — no controllers for CMS/Coupons/Reviews/Notifications yet (routes deferred to Phase 7 admin UI)
- **Notification model** — simple but extensible (type field allows future channels: email, SMS, push)
- **Coupon restrictions** — flexible (empty arrays = apply to all products/categories)
- **Review moderation** — status-based (PENDING/APPROVED/HIDDEN/REJECTED) allows workflow

---

## Verification Results (Phase 7)

| Check | Result |
|---|---|
| API typecheck | ✅ PASS |
| Storefront typecheck | ✅ PASS |
| Admin typecheck | ✅ PASS |
| API lint | ✅ PASS — 0 errors, 57 warnings (any type — minor) |
| API production build | ✅ PASS |
| Prisma client generation | ✅ PASS — Coupon, Review, Notification available |
| PostgreSQL connection | ⚠️ BLOCKED — Docker not running |
| Prisma migration apply | ⚠️ BLOCKED — requires PostgreSQL |

---

## Blockers (unchanged)

Docker Desktop installed but not running. To test Phase 7 endpoints at runtime:
1. Start Docker Desktop
2. `npm run docker:up`
3. `npm run db:migrate:dev`
4. Test admin dashboard/customer/order routes via API

---

## Next Step

Phase 8: Analytics, SEO, Security & Production Hardening

Do not start Phase 8 until explicitly instructed.

---

## Phase 6 Summary

### Prisma Schema (extended)
Models added (5 total):
- `CustomRequest` — bespoke design request (title, description, dimensions, colors, materials, budget)
- `CustomMessage` — customer↔admin communication with attachments, read/unread tracking
- `CustomQuote` — pricing proposal with version tracking (v1, v2, etc.), breakdown (design fee, material fee, dimension fee, rush fee)
- `CustomDesign` — design file upload with version history, approval workflow (pending → approved/rejected/revision-requested)

Enums added (4):
- `CustomRequestStatus` — Submitted → Under Review → Quoted → In Progress → Awaiting Approval → Approved (+ Cancelled/Completed)
- `SenderType` — Customer, Admin, System
- `QuoteStatus` — Draft, Pending, Accepted, Rejected, Revised, Expired
- `DesignApprovalStatus` — Pending, Approved, Rejected, Revision Requested

### Backend Modules Added (4 new + 2 extended)

| Module | Purpose |
|---|---|
| `CustomRequestsModule` | Customer submit bespoke design request, list/view requests, admin search/filter by status |
| `CustomMessagesModule` | Linked messaging between customer and admin, attachments, read/unread state |
| `CustomQuotesModule` | Admin create quotes with version tracking, customer accept/decline/request revision |
| `CustomDesignsModule` | Admin upload design files with versions, customer approve/reject/request revision |
| `OrdersModule` (extended) | Support custom orders (orderType=CUSTOM) with customRequestId, no cart items |
| `CheckoutModule` (extended) | New method createOrderFromCustomDesign to finalize approved design as order |

### Routes

**Customer Routes:**
- `POST /api/v1/custom-requests` — create custom design request (JwtAuthGuard)
- `GET /api/v1/custom-requests` — list user's requests
- `GET /api/v1/custom-requests/:id` — get request detail with messages/quotes/designs

**Internal Services (no routes, used by CheckoutModule):**
- `CustomRequestsService.create()` — create request with auto-generated CR-XXXXXX number
- `CustomRequestsService.findAllForUser()` — list user requests ordered by date
- `CustomMessagesService.create()` — add message with sender type (CUSTOMER/ADMIN/SYSTEM)
- `CustomMessagesService.markAsRead()` — update read status and timestamp
- `CustomQuotesService.create()` — create quote version with breakdown, auto-generated QT-XXXXXX
- `CustomQuotesService.customerAcceptQuote()` — customer accept quote
- `CustomQuotesService.customerRejectQuote()` — customer reject quote
- `CustomQuotesService.customerRequestRevision()` — request admin revision
- `CustomDesignsService.create()` — upload design file with version tracking
- `CustomDesignsService.approve()` — customer approve design (locks it for checkout)
- `CustomDesignsService.reject()` — customer reject with reason
- `CustomDesignsService.requestRevision()` — request admin redesign
- `CheckoutService.createOrderFromCustomDesign()` — finalize approved design as CUSTOM order, create payment

### Features
- **Custom request workflow** — customer submits requirements, admin reviews, quotes customer
- **Conversation threading** — customer↔admin messages linked to request, file attachments
- **Quote versioning** — admin can create v1, v2, v3 quotes; customer sees full history
- **Design versioning** — admin uploads design files (v1, v2, etc.); customer approves/rejects
- **Design approval lock** — once customer approves design, it locks for checkout (cannot be modified)
- **Custom order creation** — approved design converts to CUSTOM order with custom request linked
- **Payment integration** — custom orders go through same checkout/payment flow as standard orders
- **Status lifecycle** — custom request progresses through workflow with clear status at each stage

### Design Decisions (Phase 6)
- **Quote versioning** — tracked on CustomQuote model (version field) allows comparing v1 vs v2
- **Design versioning** — tracked separately allows multiple design iterations before approval
- **Message threading** — all communication for one request stays in one thread; easier to track context
- **Design lock** — once approved by customer, design is locked (cannot edit); prevents confusion
- **Custom order in central Order table** — custom orders use same Order model (orderType=CUSTOM) instead of separate system
- **No cart for custom orders** — custom orders have no cart items; pricing comes entirely from quote
- **Payment provider agnostic** — custom orders use same payment abstraction as standard orders

---

## Verification Results (Phase 6)

| Check | Result |
|---|---|
| API typecheck | ✅ PASS |
| Storefront typecheck | ✅ PASS |
| Admin typecheck | ✅ PASS |
| API lint | ✅ PASS — 0 errors, 12 warnings (minor) |
| API production build | ✅ PASS |
| Prisma client generation | ✅ PASS — CustomRequest, CustomMessage, CustomQuote, CustomDesign available |
| PostgreSQL connection | ⚠️ BLOCKED — Docker not running |
| Prisma migration apply | ⚠️ BLOCKED — requires PostgreSQL |

---

## Blockers (unchanged from Phase 1–5)

Docker Desktop installed but not running. To test Phase 6 endpoints at runtime:
1. Start Docker Desktop
2. `npm run docker:up`
3. `npm run db:migrate:dev`
4. Test custom design workflow via API

---

## Next Step

Phase 7: Business & Admin Management

Do not start Phase 7 until explicitly instructed.

---

## Phase 5 Summary

### Prisma Schema (extended)
Models added (8 total):
- `Address` — shipping/billing addresses, default flag, customer-linked
- `ShippingZone` — region groups with ISO country codes array
- `ShippingMethod` — shipping options per zone (basePrice, pricePerKg, freeShippingMin)
- `TaxRule` — country/region-specific tax (VAT, GST, sales tax, isInclusive flag)
- `Order` — central order model (orderNumber, status enums, historical snapshots)
- `OrderItem` — line items with productSnapshot, variantSnapshot, customization JSON
- `Payment` — provider abstraction (provider, providerPaymentId, refundedAmount)

Enums added (5):
- `AddressType` — SHIPPING, BILLING, BOTH
- `OrderType` — STANDARD, CUSTOM
- `OrderStatus` — Pending → PaymentConfirmed → Processing → Shipped → Delivered (+ Cancelled/Failed/Refunded/OnHold)
- `PaymentStatus` — Pending → Authorized → Paid (+ Failed/Refunded/PartialllyRefunded/Cancelled)
- `FulfillmentStatus` — Unfulfilled → PartiallyFulfilled → Fulfilled → Cancelled

### Backend Modules Added (6 total)

| Module | Purpose |
|---|---|
| `AddressesModule` | Customer address CRUD (JwtAuthGuard), default management, type (shipping/billing) |
| `ShippingModule` | Zone config, method rates, calculate shipping based on country + weight + order value |
| `TaxModule` | Tax rule lookup by country/region, calculate tax (VAT/GST), handle inclusive/exclusive pricing |
| `OrdersModule` | Create orders from cart with historical snapshots, status management, find/list orders |
| `PaymentsModule` | Provider abstraction, payment creation, status updates, refunds (full + partial) |
| `CheckoutModule` | Orchestrates checkout flow: cart → address → shipping → tax → order → payment |

### Routes

**Customer Routes:**
- `/api/v1/addresses` — CRUD (POST, GET, GET/:id, PATCH/:id, DELETE/:id) — JwtAuthGuard
- `/api/v1/orders` — GET (list user orders), GET /:id (order detail) — JwtAuthGuard

**Checkout Flow (not yet exposed as routes):**
- CheckoutService handles: cart validation → address selection → shipping calculation → tax calculation → order creation → payment initiation

### Features
- **Address management** — billing/shipping with default flag (auto-unsets others)
- **Shipping zones** — country-based groups with multiple shipping methods
- **Flexible rates** — basePrice + weight-based pricing + free shipping threshold
- **Tax support** — VAT/GST with country/region rules, inclusive/exclusive pricing
- **Order snapshots** — preserves product name/SKU, variant details, pricing, customization at purchase time
- **Payment abstraction** — provider-agnostic (Stripe, PayPal, Razorpay placeholders)
- **Refund support** — full + partial refunds tracked on Payment record
- **Order status lifecycle** — complete state machine from Pending → Delivered

### Design Decisions (Phase 5)
- **Guest checkout** — Address handling deferred to Phase 6 (complex guest email logic)
- **Payment provider** — Service-layer abstraction ready for Stripe/PayPal/Razorpay integration
- **Tax calculation** — Supports both inclusive (tax extracted from price) and exclusive (tax added to price)
- **Historical snapshots** — OrderItem stores JSON snapshots; product deletions don't break orders
- **Checkout orchestration** — CheckoutService coordinates all services; ready for UI integration

---

## Verification Results (Phase 5)

| Check | Result |
|---|---|
| API typecheck | ✅ PASS |
| Storefront typecheck | ✅ PASS |
| Admin typecheck | ✅ PASS |
| API lint | ✅ PASS — 0 errors, 8 warnings (minor) |
| API production build | ✅ PASS |
| Prisma client generation | ✅ PASS — Address, ShippingZone, ShippingMethod, TaxRule, Order, OrderItem, Payment available |
| PostgreSQL connection | ⚠️ BLOCKED — Docker not running |
| Prisma migration apply | ⚠️ BLOCKED — requires PostgreSQL |

---

## Blockers (unchanged from Phase 1–4)

Docker Desktop installed but not running. To test Phase 5 endpoints at runtime:
1. Start Docker Desktop
2. `npm run docker:up`
3. `npm run db:migrate:dev`
4. Test checkout flow via API

---

## Next Step

Phase 6: Luxury Custom Design Order Engine

Do not start Phase 6 until explicitly instructed.

---

## Phase 4 Summary

### Dependencies Added (`apps/api`)
None (Phase 4 uses existing dependencies)

### Prisma Schema (extended)
Models added:
- `Cart` — shopping cart (userId for customer, sessionId for guest, currency, expiresAt for guest carts)
- `CartItem` — cart line items (productId, variantId, quantity, customization JSON, priceSnapshot)
- `Wishlist` — customer wishlist (userId, unique per user)
- `WishlistItem` — wishlist items (productId, variantId, unique constraint on wishlist+product+variant)

Relations added:
- `User.carts` — one-to-many
- `User.wishlists` — one-to-many
- `Product.cartItems` — one-to-many
- `Product.wishlistItems` — one-to-many
- `ProductVariant.cartItems` — one-to-many
- `ProductVariant.wishlistItems` — one-to-many

### Backend Modules Added

| Module | Purpose |
|---|---|
| `CartModule` | Guest cart (sessionId, 30-day TTL) + customer cart (userId). Add/update/remove items, clear cart, calculate totals, merge guest cart on login. OptionalJwtAuthGuard supports both guest and authenticated users. |
| `WishlistModule` | Customer-only wishlist (JwtAuthGuard). Add/remove/toggle, clear, move-to-cart (integrates with CartService), check if item in wishlist. Unique constraint prevents duplicates. |

### Cart Routes — `/api/v1/cart/...`
- `GET /` — get cart (guest or customer)
- `GET /totals` — calculate cart subtotal, item count, currency
- `POST /items` — add item to cart (product + optional variant + qty + customization)
- `PATCH /items/:itemId` — update cart item (quantity or customization)
- `DELETE /items/:itemId` — remove cart item
- `DELETE /clear` — clear entire cart
- `POST /merge` — merge guest cart into customer cart on login

**Guard:** `OptionalJwtAuthGuard` — supports both guest (via sessionId cookie/header) and authenticated users

### Wishlist Routes — `/api/v1/wishlist/...`
- `GET /` — get customer wishlist
- `POST /items` — add item to wishlist (product + optional variant)
- `POST /toggle` — toggle item (add if not present, remove if present)
- `DELETE /items/:itemId` — remove item from wishlist
- `DELETE /clear` — clear entire wishlist
- `POST /move-to-cart` — move wishlist item to cart with quantity
- `GET /check?productId=...&variantId=...` — check if item is in wishlist

**Guard:** `JwtAuthGuard` — customer authentication required

### Features
- **Guest cart** — sessionId-based, 30-day TTL, auto-expires
- **Customer cart** — userId-based, persistent
- **Cart merge on login** — seamlessly combines guest + customer carts
- **Price snapshot** — stores price at add-to-cart time (prevents price manipulation)
- **Customization support** — JSON field stores selected options
- **Cart totals** — server-side calculation (subtotal, item count, currency)
- **Wishlist toggle** — add/remove in single operation
- **Move to cart** — direct wishlist → cart transfer
- **Uniqueness** — wishlist prevents duplicate product+variant combinations

---

## Verification Results (Phase 4)

| Check | Result |
|---|---|
| API typecheck | ✅ PASS |
| Storefront typecheck | ✅ PASS |
| Admin typecheck | ✅ PASS |
| API lint | ✅ PASS — 0 errors, 0 warnings |
| API production build | ✅ PASS |
| Prisma client generation | ✅ PASS — Cart, CartItem, Wishlist, WishlistItem available |
| PostgreSQL connection | ⚠️ BLOCKED — Docker not running |
| Prisma migration apply | ⚠️ BLOCKED — requires PostgreSQL |

---

## Blockers (unchanged from Phase 1, 2 & 3)

Docker Desktop installed but not running. To test cart/wishlist endpoints at runtime:
1. Start Docker Desktop
2. `npm run docker:up`
3. `npm run db:migrate:dev`
4. Test cart/wishlist API via Postman/Thunder Client

---

## Next Step

Phase 5: Checkout, Payments, Shipping & Orders

Do not start Phase 5 until explicitly instructed.

---

## Phase 3 Summary

### Dependencies Added (`apps/api`)
- `slugify@^1.6.9` — auto-generate URL-safe slugs from names

### Prisma Schema (extended)
Models added:
- `Category` — hierarchical categories (parentId, sortOrder, slug, image, SEO, status, soft-delete)
- `Product` — products (name, slug, sku, description, pricing, dimensions, SEO, status, soft-delete)
- `ProductVariant` — size/style/color variants (sku, pricing overrides, stock, reserved, low-stock threshold)
- `ProductMedia` — product images/videos (sortOrder, isMain flag, upload key + URL)
- `ProductCustomizationOption` — predefined customization (groupName, optionLabel, priceDelta)
- `InventoryLog` — full audit trail (manual adjust, reserve, release, deduct, restock)

Enums added:
- `CategoryStatus` — ACTIVE | HIDDEN | ARCHIVED
- `ProductStatus` — DRAFT | ACTIVE | HIDDEN | ARCHIVED
- `MediaType` — IMAGE | VIDEO
- `InventoryChange` — MANUAL_ADJUST | ORDER_RESERVE | ORDER_RELEASE | ORDER_DEDUCT | RETURN_RESTOCK | INITIAL_STOCK | CORRECTION

### Backend Modules Added

| Module | Purpose |
|---|---|
| `CategoriesModule` | Admin CRUD, slug auto-generation, image, SEO, reorder, hide/archive/restore, soft-delete. Public read-only endpoints. |
| `ProductsModule` | Admin CRUD for products, variants, media, customization options. Publish/hide/archive/restore, soft-delete. Public storefront endpoints. |
| `InventoryModule` | Manual stock adjustment, reserve/release/deduct for orders, low-stock detection, full InventoryLog history. |
| `StorefrontModule` | Unified public API: category tree, product listing (filter by category/featured/search), product detail by slug, featured products. |

### Admin Routes (Categories) — `/api/v1/admin/categories/...`
- `POST /` — create category with optional slug, image, SEO, ordering
- `GET /` — list all categories (filter by status, parentId, pagination)
- `GET /:id` — get single category (admin view)
- `PATCH /:id` — update category (name, slug, image, SEO, status, ordering)
- `PATCH /:id/hide` — set status HIDDEN
- `PATCH /:id/archive` — set status ARCHIVED + timestamp
- `PATCH /:id/restore` — set status ACTIVE
- `DELETE /:id` — soft-delete (blocks if products exist, suggests archive)
- `POST /reorder` — batch update sortOrder

### Public Routes (Categories) — `/api/v1/categories/...`
- `GET /` — list top-level active categories with children
- `GET /:slug` — get category by slug (active only)

### Admin Routes (Products) — `/api/v1/admin/products/...`
- `POST /` — create product with variants, media, customization options
- `GET /` — list all products (filter by status, category, featured, pagination)
- `GET /:id` — get product with variants, media, customization
- `PATCH /:id` — update product
- `PATCH /:id/publish` — set status ACTIVE + publishedAt timestamp
- `PATCH /:id/hide` — set status HIDDEN
- `PATCH /:id/archive` — set status ARCHIVED + timestamp
- `PATCH /:id/restore` — set status ACTIVE
- `DELETE /:id` — soft-delete
- `POST /:id/variants` — add variant
- `PATCH /variants/:variantId` — update variant
- `DELETE /variants/:variantId` — soft-delete variant
- `POST /:id/media` — add image/video (URL + optional storage key)
- `PATCH /media/:mediaId` — update media (isMain flag unsets others)
- `DELETE /media/:mediaId` — delete media
- `POST /:id/customization-options` — add option (groupName, label, priceDelta)
- `PATCH /customization-options/:optionId` — update option
- `DELETE /customization-options/:optionId` — delete option

### Public Routes (Products) — `/api/v1/products/...`
- `GET /` — list active products (filter by category, featured, pagination)
- `GET /:slug` — get product detail by slug (active only, with variants, media, options)

### Admin Routes (Inventory) — `/api/v1/admin/inventory/...`
- `POST /adjust` — manual adjust (MANUAL_ADJUST, INITIAL_STOCK, CORRECTION, etc.)
- `GET /low-stock` — list variants below lowStockAt threshold
- `GET /logs` — paginated InventoryLog history (filter by product, variant, changeType)

### Public Routes (Storefront) — `/api/v1/storefront/...`
- `GET /categories` — active category tree
- `GET /categories/:slug` — category detail
- `GET /products` — product listing (filter by category, featured, search term)
- `GET /products/:slug` — product detail
- `GET /featured` — featured products (configurable limit)

### Utility
- `slug.util.ts` — `generateSlug()` + `uniqueSlug()` with collision detection (timestamp suffix)

### Features
- **Auto-slugs** — generated from name, collision-safe
- **Soft-delete** — `deletedAt` timestamp for categories, products, variants
- **Variant inventory** — `stockQty`, `reservedQty`, `lowStockAt` threshold
- **Image support** — dual approach: imageUrl (always present) + optional imageKey (object storage)
- **Audit logging** — all admin mutations logged via AuditService
- **SEO fields** — seoTitle, seoDesc on categories and products
- **Category hierarchy** — self-referential parentId for tree structure
- **Product variants** — optional price/dimension overrides, inherit from parent if null
- **Product media** — sortOrder + isMain flag for primary image
- **Customization options** — grouped (Size, Color, Material) with price deltas
- **Inventory reservation** — reserve/release/deduct flow for order processing
- **Low-stock alerts** — configurable per-variant threshold

---

## Verification Results (Phase 3)

| Check | Result |
|---|---|
| API typecheck | ✅ PASS |
| Storefront typecheck | ✅ PASS |
| Admin typecheck | ✅ PASS |
| API lint | ✅ PASS — 0 errors, 0 warnings |
| API production build | ✅ PASS |
| Prisma client generation | ✅ PASS — all new models available |
| PostgreSQL connection | ⚠️ BLOCKED — Docker not running |
| Prisma migration apply | ⚠️ BLOCKED — requires PostgreSQL |
| Redis connection | ⚠️ BLOCKED — Docker not running |

---

## Blockers (unchanged from Phase 1 & 2)

Docker Desktop installed but not running. To complete runtime verification:
1. Start Docker Desktop
2. `npm run docker:up`
3. `npm run db:migrate:dev`
4. `npm run db:seed`
5. `npm run dev:api`
6. Test catalog endpoints

---

## Next Step

Phase 4: Cart, Checkout & Orders

Do not start Phase 4 until explicitly instructed.

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
