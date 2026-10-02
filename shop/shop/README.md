# SHOPNAME: Full-stack E-Commerce (React + Supabase)

A responsive game-store web app with a customer storefront and an admin dashboard. Built as a portfolio project to demonstrate a realistic full-stack flow: browsing, cart, authentication, checkout with server-side stock control, order management and analytics.

## Features

**Storefront**
- Home, product listing with search, filters (category, price, rating, stock), sorting and pagination (state kept in the URL)
- Product detail with gallery, quantity selector, related products
- Cart (persisted), coupon codes, order summary with free-shipping rule
- Checkout with form validation and a mock payment UI (no real payments, no card data stored)
- Order history, order detail with progress timeline, customer-side order cancellation (stock is returned)
- Wishlist, editable profile
- Sign up / log in with **email or username**, protected routes, persistent sessions

**Admin** (`/admin`, admin role only)
- Overview: revenue, orders, users, products, 6-month charts, recent orders and users
- Products CRUD with search, filter, sort, pagination and delete confirmation
- Orders: change status (cancelling returns stock)
- Users: search, filter, view, change role, disable
- Analytics: revenue line chart, orders bar chart, category share, top products

**Quality**
- Loading, error and empty states on every data page; toast notifications; error boundary
- Accessible: labelled forms, keyboard-friendly modals with focus trap, skip link, focus moved to content on navigation, reduced-motion support
- Code-splitting by route, vendor chunks, lazy-loaded images

## Tech stack
React 18, JavaScript (ES modules), React Router 6, Vite, HTML5, CSS3 (custom properties, no UI framework), Supabase (PostgreSQL, Auth, Row Level Security, RPC functions), Docker + nginx, Git/GitHub.

## Architecture notes
- **Server-side business rules:** prices, discounts, shipping and stock are computed inside Postgres functions (`place_order`, `cancel_order`, `admin_set_order_status`). The browser only sends product ids, quantities and a coupon code, so totals cannot be tampered with.
- **Row Level Security everywhere:** customers can read only their own orders, wishlist and profile; admin actions are checked in the database, not just hidden in the UI.
- **Service layer:** components never call Supabase directly; they use `src/services/*` and shared hooks/contexts (`AuthContext`, `CartContext`, `WishlistContext`, `ToastContext`).

## Database schema

```text
profiles ─┬─ orders ── order_items ── products ── categories
          └─ wishlists ─────────────── products
coupons (accessed only through the validate_coupon RPC)
```

| Table | Purpose |
|---|---|
| profiles | user data, `username`, `role` (customer/admin), `status` (active/disabled) |
| categories, products | catalogue (stock, prices, rating, status active/draft) |
| orders, order_items | purchases with price snapshots |
| wishlists | per-user saved products |
| coupons | percent/fixed discounts with minimum spend |

RPC functions: `place_order`, `cancel_order`, `validate_coupon`, `username_available`, `email_for_username`, `admin_dashboard`, `admin_analytics`, `admin_set_order_status`, `admin_update_user`.

## Installation

Requirements: Node.js 18+ (or Docker Desktop) and a Supabase project.

```bash
git clone <your-repo-url> && cd shop
cp .env.example .env     # then fill in the values below
npm install
npm run dev              # http://localhost:5173
```

### Environment variables

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon / publishable key |

Never put the database password or the `service_role` key in this app or commit `.env`.

### Database setup
Create the tables, RLS policies and functions described above in your Supabase project (SQL Editor), then seed `categories`, `products` and `coupons`. For quick local demos, disable *Authentication → Providers → Email → Confirm email*.

### Docker

```bash
docker compose up --build                       # dev  -> http://localhost:5173
docker compose --profile prod up --build prod   # prod -> http://localhost:8080
```

## Demo accounts
Create these yourself after setup (no credentials are shipped in the repo):
1. Register a normal customer account in the UI.
2. Register another account, then promote it:
   ```sql
   update public.profiles set role = 'admin' where email = 'admin@example.com';
   ```
Demo coupon codes: `SAVE10`, `GAME20` (min. $50), `WELCOME5`. For the mock card payment use any 16 digits, e.g. `4242 4242 4242 4242`.

## Screenshots
_Add screenshots here (home, products, cart, checkout, orders, admin dashboard)._

## Project structure
```text
src/
├── admin/        admin pages (layout, dashboard, products, orders, users, analytics)
├── components/   reusable UI (ProductCard, Modal, Pagination, charts, ...)
├── context/      Auth, Cart, Wishlist, Toast
├── hooks/        useAsync, useAddToCart
├── layouts/      MainLayout
├── lib/          supabase client, pricing, validators, formatters
├── pages/        storefront pages
├── routes/       AppRoutes, ProtectedRoute
└── services/     product, order, user, wishlist, coupon, auth, admin
```

## Resume summary
- Built a responsive e-commerce platform with React, JavaScript, HTML and CSS: search, filtering, sorting, pagination, cart, wishlist, checkout and order management.
- Integrated Supabase PostgreSQL and Auth with Row Level Security and transactional Postgres functions for stock-safe order placement and cancellation.
- Developed an admin dashboard with product CRUD, order and user management, and sales analytics.
- Designed reusable components, route-level code-splitting and an accessible, mobile-first UI; containerised with Docker and nginx.
