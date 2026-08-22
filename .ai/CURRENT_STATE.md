# Current State

## Project Status

Phase: **PHASE 3 COMPLETE — Catalog, Products, Categories & Inventory**

Phase 1, Phase 2, and Phase 3 are verified and pushed to `origin/main`.

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
